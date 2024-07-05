"""
### Stable Diffusion XL on Beam ###

**Deploy it as an API**

beam deploy sdxl.py:generate_image
"""
from beam import App, Output, Volume, Runtime, Image
import torch
from diffusers import DiffusionPipeline, AutoencoderKL
from common import extract_tokens, handle_loras, unload_loras

cache_path = "./models"

def load_models():
    vae = AutoencoderKL.from_pretrained(
        "madebyollin/sdxl-vae-fp16-fix", 
        torch_dtype=torch.float16
    ).to("cuda")

    pipe = DiffusionPipeline.from_pretrained(
        "stabilityai/stable-diffusion-xl-base-1.0", 
        torch_dtype=torch.float16, 
        variant="fp16", 
        use_safetensors=True,
        vae=vae
    ).to("cuda")

    refiner = DiffusionPipeline.from_pretrained(
        "stabilityai/stable-diffusion-xl-refiner-1.0",
        text_encoder_2=pipe.text_encoder_2,
        vae=vae,
        torch_dtype=torch.float16,
        use_safetensors=True,
        variant="fp16",
    ).to("cuda")

    return pipe, refiner

app = App(
        name="t2i-sdxl",
        runtime=Runtime(
            cpu=2,
            memory="16Gi",
            gpu="A10G",
            image=Image(
                python_version="python3.8",
                python_packages=[
                    "diffusers[torch]>=0.10",
                    "transformers",
                    "torch",
                    "pillow",
                    "accelerate",
                    "safetensors",
                    "xformers",
                    "accelerate"
                ],
            ),
        ),
        volumes=[
            Volume(name="models", path="./models"),
            Volume(name="loras", path="./loras")
        ],
    )

@app.task_queue(
    loader=load_models,
    outputs=[Output(path="output.png")],
    keep_warm_seconds=60,
)
def generate_image(**inputs):
    # Grab inputs passed to the API
    prompt = inputs["prompt"]
    cleaned_string, extracted_data = extract_tokens(prompt)

    # Grab inputs passed to the API
    negative_prompt = inputs.get("negative_prompt", "")
    height = int(inputs.get("height", "1024"))
    width = int(inputs.get("width", "1024"))
    steps = int(inputs.get("steps", "50"))
    scale = float(inputs.get("guidance_scale", "7.5"))
    use_refiner = bool(inputs.get("use_refiner", "true"))
    
    # Retrieve pre-loaded model from loader
    pipe, refiner = inputs["context"]

    lora_names = handle_loras(extracted_data=extracted_data, pipe=pipe)

    torch.backends.cuda.matmul.allow_tf32 = True

    with torch.inference_mode():
        with torch.autocast("cuda"):
            if use_refiner:
                image = pipe(
                    prompt=cleaned_string, 
                    num_inference_steps=steps, 
                    negative_prompt=negative_prompt,
                    guidance_scale=scale,
                    height=height,
                    width=width,
                    denoising_end=0.8,
                    output_type="latent",
                ).images
                image = refiner(
                    prompt=cleaned_string,
                    num_inference_steps=steps,
                    negative_prompt=negative_prompt,
                    guidance_scale=scale,
                    height=height,
                    width=width,
                    denoising_start=0.8,
                    image=image,
                ).images[0]
            else:
                image = pipe(
                    prompt=cleaned_string, 
                    num_inference_steps=steps, 
                    guidance_scale=scale,
                    negative_prompt=negative_prompt,
                    height=height,
                    width=width
                ).images[0]

    unload_loras(lora_names, pipe)

    print(f"Saved Image: {image}")
    image.save("output.png")

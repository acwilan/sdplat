"""
### Stable Diffusion 2 on Beam ###

**Deploy it as an API**

beam deploy sd2.py:generate_image
"""
from beam import App, Output, Volume, Runtime, Image
import torch
from diffusers import DiffusionPipeline, AutoencoderKL, StableDiffusionLatentUpscalePipeline, StableDiffusionImg2ImgPipeline
from common import extract_tokens, handle_loras, unload_loras

cache_path = "./models"

def load_models():
    vae = AutoencoderKL.from_pretrained(
        "stabilityai/sd-vae-ft-mse"
    )
    pipe = DiffusionPipeline.from_pretrained(
        "stabilityai/stable-diffusion-2-1",
        torch_dtype=torch.float16,
        cache_dir=cache_path,
        variant="fp16",
        vae=vae,
        safety_checker=None,
        use_safetensors=True
    )
    upscaler = StableDiffusionLatentUpscalePipeline.from_pretrained(
        "stabilityai/sd-x2-latent-upscaler", 
        torch_dtype=torch.float16
    )
    img2img = StableDiffusionImg2ImgPipeline(**pipe.components)

    return pipe.to("cuda"), upscaler.to("cuda"), img2img.to("cuda")

app = App(
        name="t2i-sd2",
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
                    "scipy",
                    "ftfy"
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
    height = int(inputs.get("height", "768"))
    width = int(inputs.get("width", "768"))
    steps = int(inputs.get("steps", "50"))
    scale = float(inputs.get("guidance_scale", "7.5"))
    
    # Retrieve pre-loaded model from loader
    pipe, upscaler, img2img = inputs["context"]

    lora_names = handle_loras(extracted_data=extracted_data, pipe=pipe)

    torch.backends.cuda.matmul.allow_tf32 = True

    with torch.inference_mode():
        with torch.autocast("cuda"):
            image = pipe(
                cleaned_string, 
                num_inference_steps=steps, 
                guidance_scale=scale,
                negative_prompt=negative_prompt,
                height=height,
                width=width,
                output_type="latent"
            ).images[0]

    image = upscaler(
        prompt,
        image=image,
        num_inference_steps=steps,
        guidance_scale=scale,
        output_type="latent"
    ).images[0]

    image = img2img(prompt, 
                    image=image,
                    num_inference_steps=steps, 
                    strength=0.5, 
                    output_type="pt"
                    )

    unload_loras(lora_names, pipe)

    print(f"Saved Image: {image}")
    image.save("output.png")

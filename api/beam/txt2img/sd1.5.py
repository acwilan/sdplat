"""
### Stable Diffusion 1.5 on Beam ###

**Deploy it as an API**

beam deploy sd1.5.py:generate_image
"""
from beam import App, Output, Volume, Runtime, Image
import torch
from diffusers import StableDiffusionPipeline
from common import extract_tokens, handle_loras, unload_loras

cache_path = "./models"

def load_models():
    pipe = StableDiffusionPipeline.from_pretrained(
        "runwayml/stable-diffusion-v1-5",
        torch_dtype=torch.float16,
        cache_dir=cache_path,
        variant="fp16",
        safety_checker=None,
        use_safetensors=True
    ).to("cuda")

    return pipe

app = App(
        name="t2i-sd1.5",
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
    negative_prompt = inputs.get("negative_prompt", "(deformed iris, deformed pupils), text, worst quality, low quality, jpeg artifacts, duplicate, morbid, mutilated, (extra fingers), (mutated hands), poorly drawn hands, poorly drawn face, mutation, deformed, blurry, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, (fused fingers), (too many fingers), long neck, camera")
    height = int(inputs.get("height", "512"))
    width = int(inputs.get("width", "512"))
    steps = int(inputs.get("steps", "50"))
    scale = float(inputs.get("guidance_scale", "7.5"))
    
    # Retrieve pre-loaded model from loader
    pipe = inputs["context"]

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
                width=width
            ).images[0]

    unload_loras(lora_names, pipe)

    print(f"Saved Image: {image}")
    image.save("output.png")

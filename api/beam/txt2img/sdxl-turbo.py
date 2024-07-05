"""
### Stable Diffusion XL Turbo on Beam ###

**Deploy it as an API**

beam deploy sdxl-turbo.py:generate_image
"""
from beam import App, Output, Volume, Runtime, Image
import torch
from diffusers import AutoPipelineForText2Image
from common import extract_tokens, handle_loras, unload_loras

cache_path = "./models"

def load_models():
    pipe = AutoPipelineForText2Image.from_pretrained(
        "stabilityai/sdxl-turbo",
        torch_dtype=torch.float32,
        cache_dir=cache_path,
        variant="fp16",
        use_safetensors=True,
    )

    return pipe

app = App(
        name="t2i-sdxl-turbo",
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
    steps = int(inputs.get("steps", "4"))
    
    # Retrieve pre-loaded model from loader
    pipe = inputs["context"]

    lora_names = handle_loras(extracted_data=extracted_data, pipe=pipe)

    torch.backends.cuda.matmul.allow_tf32 = True

    with torch.inference_mode():
        with torch.autocast("cuda"):
            image = pipe(
                prompt=cleaned_string, 
                num_inference_steps=steps, 
                guidance_scale=0.0,
                negative_prompt=negative_prompt,
                height=512,
                width=512
            ).images[0]

    unload_loras(lora_names, pipe)

    print(f"Saved Image: {image}")
    image.save("output.png")

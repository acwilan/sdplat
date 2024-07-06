"""
### Animate diff XL text to video on Beam ###

**Deploy it as an API**

beam deploy animatediff-xl.py:generate_video
"""
from beam import App, Output, Volume, Runtime, Image
import torch
from diffusers import AnimateDiffSDXLPipeline, DDIMScheduler
from diffusers.models import MotionAdapter
from diffusers.utils import export_to_gif
from common import extract_tokens, handle_loras, unload_loras

cache_path = "./models"
model_id = "stabilityai/stable-diffusion-xl-base-1.0"

def load_models():
    adapter = MotionAdapter.from_pretrained(
        "guoyww/animatediff-motion-adapter-sdxl-beta", 
        torch_dtype=torch.float16)
    scheduler = DDIMScheduler.from_pretrained(
        model_id,
        subfolder="scheduler",
        clip_sample=False,
        timestep_spacing="linspace",
        beta_schedule="linear",
        steps_offset=1,
    )
    pipe = AnimateDiffSDXLPipeline.from_pretrained(
        model_id,
        motion_adapter=adapter,
        torch_dtype=torch.float16,
        variant="fp16",
        cache_dir=cache_path,
        use_safetensors=True,
        scheduler=scheduler
    ).to("cuda")

    return pipe

app = App(
        name="t2v-animatediff-xl",
        runtime=Runtime(
            cpu=2,
            memory="32Gi",
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
                    "opencv-python",
                    "peft",
                ],
            ),
        ),
        volumes=[
            Volume(name="models", path="./models"),
            Volume(name="loras", path="./loras"),
        ],
    )

@app.task_queue(
    loader=load_models,
    outputs=[Output(path="output.gif")],
    keep_warm_seconds=60,
)
def generate_video(**inputs):
    # Grab inputs passed to the API
    prompt = inputs["prompt"]
    cleaned_string, extracted_data = extract_tokens(prompt)

    # Grab inputs passed to the API
    negative_prompt = inputs.get("negative_prompt", "")
    height = int(inputs.get("height", "1024"))
    width = int(inputs.get("width", "1024"))
    steps = int(inputs.get("steps", "20"))
    scale = float(inputs.get("guidance_scale", "8"))

    # Retrieve pre-loaded model from loader
    pipe = inputs["context"]

    lora_names = handle_loras(extracted_data=extracted_data, pipe=pipe)

    torch.backends.cuda.matmul.allow_tf32 = True
    generator = torch.manual_seed(42)

    with torch.inference_mode():
        with torch.autocast("cuda"):
            frames = pipe(
                cleaned_string, 
                negative_prompt=negative_prompt,
                num_frames=16,
                guidance_scale=scale,
                num_inference_steps=steps, 
                height=height,
                width=width,
                generator=generator,
            ).frames[0]

    unload_loras(lora_names, pipe)

    export_to_gif(frames, "output.gif")

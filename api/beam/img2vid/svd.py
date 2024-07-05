"""
### Stable Video Diffusion on Beam ###

**Deploy it as an API**

beam deploy svd.5.py:generate_video
"""
from beam import App, Output, Volume, Runtime, Image
import torch
from diffusers import StableVideoDiffusionPipeline, AutoencoderKL, DiffusionPipeline
from diffusers.utils import load_image, export_to_video

cache_path = "./models"

def load_models():
    pipe = StableVideoDiffusionPipeline.from_pretrained(
        "stabilityai/stable-video-diffusion-img2vid-xt",
        torch_dtype=torch.float16,
        cache_dir=cache_path,
        variant="fp16",
        use_safetensors=True
    ).to("cuda")

    return pipe

app = App(
        name="i2v-svd",
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
                    "opencv-python",
                ],
            ),
        ),
        volumes=[
            Volume(name="models", path="./models"),
        ],
    )

@app.task_queue(
    loader=load_models,
    outputs=[Output(path="output.mp4")],
    keep_warm_seconds=60,
)
def generate_video(**inputs):
    # Grab inputs passed to the API
    image_url = inputs["image_url"]

    # Retrieve pre-loaded model from loader
    pipe = inputs["context"]

    torch.backends.cuda.matmul.allow_tf32 = True
    generator = torch.manual_seed(42)
    image = load_image(f"{image_url}")
    image = image.resize((1024, 576))

    with torch.inference_mode():
        with torch.autocast("cuda"):
            frames = pipe(image, 
                          decode_chunk_size=2, 
                          generator=generator).frames[0]

    export_to_video(frames, "output.mp4", fps=7)

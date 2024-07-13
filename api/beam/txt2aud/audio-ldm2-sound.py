"""
### AudioLDM 2 Sound on Beam ###

**Deploy it as an API**

beam deploy audio-ldm2-sound.py:generate_sound
"""
from beam import App, Output, Volume, Runtime, Image
import torch
from diffusers import AudioLDM2Pipeline
import scipy

cache_path = "./models"

def load_models():
    sound_pipe = AudioLDM2Pipeline.from_pretrained(
        "cvssp/audioldm2",
        torch_dtype=torch.float16,
        cache_dir=cache_path,
    ).to("cuda")

    return sound_pipe

app = App(
        name="t2a-audio-ldm2-sound",
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
                ],
            ),
        ),
        volumes=[
            Volume(name="models", path="./models"),
        ],
    )

"""
"""
@app.task_queue(
    loader=load_models,
    outputs=[Output(path="output.wav")],
    keep_warm_seconds=60,
)
def generate_music(**inputs):
    # Grab inputs passed to the API
    prompt = inputs["prompt"]
    negative_prompt = inputs.get("negative_prompt", "")
    steps = int(inputs.get("steps", "200"))
    length = float(inputs.get("length", "10.0"))
    waveformspp = int(inputs.get("waveformspp", "3"))

    generator = torch.Generator("cuda").manual_seed(0)
    
    # Retrieve pre-loaded model from loader
    sound_pipe = inputs["context"]

    with torch.inference_mode():
        with torch.autocast("cuda"):
            audio = sound_pipe(
                prompt, 
                negative_prompt=negative_prompt,
                num_inference_steps=steps, 
                audio_length_in_s=length,
                num_waveforms_per_prompt=waveformspp,
                generator=generator,
            ).audios[0]

    scipy.io.wavfile.write("output.wav", rate=16000, data=audio)

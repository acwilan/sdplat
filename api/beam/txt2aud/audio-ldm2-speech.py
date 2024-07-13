"""
### AudioLDM 2 Speech on Beam ###

**Deploy it as an API**

beam deploy audio-ldm2-speech.py:generate_speech
"""
from beam import App, Output, Volume, Runtime, Image
import torch
from diffusers import AudioLDM2Pipeline
import scipy

cache_path = "./models"

def load_models():
    speech_pipe = AudioLDM2Pipeline.from_pretrained(
        "anhnct/audioldm2_gigaspeech",
        torch_dtype=torch.float16,
        cache_dir=cache_path,
        use_safetensors=False,
    ).to("cuda")

    return speech_pipe

app = App(
        name="t2a-audio-ldm2-speech",
        runtime=Runtime(
            cpu=2,
            memory="16Gi",
            gpu="A10G",
            image=Image(
                python_version="python3.8",
                commands=[
                    "apt-get update -y && apt-get install festival espeak-ng mbrola -y"
                ],
                python_packages=[
                    "diffusers[torch]>=0.10",
                    "transformers",
                    "torch",
                    "pillow",
                    "accelerate",
                    "safetensors",
                    "xformers",
                    "scipy",
                    "phonemizer",
                ],
            ),
        ),
        volumes=[
            Volume(name="models", path="./models"),
        ],
    )

@app.task_queue(
    loader=load_models,
    outputs=[Output(path="output.wav")],
    keep_warm_seconds=60,
)
def generate_speech(**inputs):
    # Grab inputs passed to the API
    prompt = inputs["prompt"]
    transcript = inputs["transcript"]
    negative_prompt = inputs.get("negative_prompt", "")
    steps = int(inputs.get("steps", "200"))
    length = float(inputs.get("length", "10.0"))
    waveformspp = int(inputs.get("waveformspp", "3"))

    generator = torch.Generator("cuda").manual_seed(0)
    
    # Retrieve pre-loaded model from loader
    speech_pipe = inputs["context"]

    with torch.inference_mode():
        with torch.autocast("cuda"):
            audio = speech_pipe(
                prompt, 
                negative_prompt=negative_prompt,
                transcription=transcript,
                num_inference_steps=steps, 
                audio_length_in_s=length,
                num_waveforms_per_prompt=waveformspp,
                generator=generator,
                max_new_tokens=512,
            ).audios[0]

    scipy.io.wavfile.write("output.wav", rate=16000, data=audio)

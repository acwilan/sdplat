import re

def extract_tokens(input_string):
    tokens = re.findall(r'<lora:([^:]+):([0-9.]+)>', input_string)
    print(f"Found {len(tokens)} tokens")
    cleaned_string = re.sub(r'<lora:[^>]+>', '', input_string)
    extracted_data = [{'name': token[0], 'scale': float(token[1])} for token in tokens]
    return cleaned_string, extracted_data

def handle_loras(extracted_data, pipe):
    lora_names = []
    if extracted_data:
        lora_scales = []
        for token in extracted_data:
            lora_name = token['name']
            print(f"Found lora with name {lora_name}")
            lora_scale = token['scale']
            pipe.load_lora_weights(
                "./loras", 
                weight_name=f"{lora_name}.safetensors", 
                adapter_name=lora_name)
            lora_names.append(lora_name)
            lora_scales.append(lora_scale)
        pipe.set_adapters(lora_names, lora_scales)
    return lora_names

def unload_loras(lora_names, pipe):
    if lora_names:
        pipe.delete_adapters(lora_names)

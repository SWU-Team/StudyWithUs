import torch
from transformers import AutoModelForCausalLM
from peft import get_peft_model
from configs.lora_config import get_lora_config

BASE_MODEL = "heegyu/polyglot-ko-1.3b-chat"

def get_model():
    model = AutoModelForCausalLM.from_pretrained(
        BASE_MODEL,
        torch_dtype=torch.float16
    )
    model = model.to("cuda")
    model.gradient_checkpointing_enable()
    model = get_peft_model(model, get_lora_config())
    return model

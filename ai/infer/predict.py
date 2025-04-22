# 추론 CLI 코드

# ai/infer/predict.py

import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
from peft import PeftModel

BASE_MODEL = "heegyu/polyglot-ko-1.3b-chat"
FINETUNED_MODEL_PATH = "./outputs"

# 토크나이저 로드
tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL)
tokenizer.pad_token = tokenizer.eos_token
tokenizer.padding_side = "right"

# 기본 모델 로드
base_model = AutoModelForCausalLM.from_pretrained(BASE_MODEL, torch_dtype=torch.float16)
base_model = base_model.to("cuda")

# LoRA 모델 병합
model = PeftModel.from_pretrained(base_model, FINETUNED_MODEL_PATH)
model.eval()

def generate_response(user_input: str):
    prompt = f"<|user|>\n{user_input}\n<|assistant|>\n"
    inputs = tokenizer(prompt, return_tensors="pt").to("cuda")

    with torch.no_grad():
        output = model.generate(
            **inputs,
            max_new_tokens=200,
            temperature=0.7,
            top_p=0.9,
            do_sample=True,
            pad_token_id=tokenizer.eos_token_id
        )

    response = tokenizer.decode(output[0], skip_special_tokens=True)
    return response.replace(prompt, "").strip()


if __name__ == "__main__":
    print("💬 공부 내용을 입력해 보세요!")
    user_text = input("> ")
    result = generate_response(user_text)
    print("\n🧠 모델 응답:\n", result)

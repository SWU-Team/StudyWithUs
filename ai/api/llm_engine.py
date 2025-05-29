import os
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM

# 절대 경로로 변환
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MERGED_MODEL_PATH = os.path.join(BASE_DIR, "../output/merged_model-16000")

tokenizer = AutoTokenizer.from_pretrained(MERGED_MODEL_PATH, local_files_only=True)
tokenizer.pad_token = tokenizer.eos_token
tokenizer.padding_side = "right"

model = AutoModelForCausalLM.from_pretrained(
    MERGED_MODEL_PATH, torch_dtype=torch.float16, local_files_only=True
).to("cuda")
model.eval()

def infer(prompt: str, max_new_tokens: int = 512) -> str:
    try:
        formatted = f"<|user|>\n{prompt.strip()}\n<|assistant|>\n"
        inputs = tokenizer(formatted, return_tensors="pt").to(model.device)
        inputs.pop("token_type_ids", None)
        with torch.no_grad():
            outputs = model.generate(
                **inputs,
                max_new_tokens=max_new_tokens,
                temperature=0.7,
                top_p=0.9,
                do_sample=True,
                pad_token_id=tokenizer.eos_token_id,
                repetition_penalty=1.1,
            )
        result = tokenizer.decode(outputs[0], skip_special_tokens=True)
        return result.split("<|assistant|>")[-1].strip()
    except Exception as e:
        print("[infer] Error:", e)
        return "AI 피드백 생성 중 오류가 발생했습니다."


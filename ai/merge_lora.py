import torch
from transformers import AutoModelForCausalLM
from peft import PeftModel

# 설정값
BASE_MODEL = "heegyu/polyglot-ko-1.3b-chat"
CHECKPOINT = 1000

FINETUNED_MODEL_PATH = f"ai/output/checkpoint-{CHECKPOINT}"
MERGED_MODEL_PATH = f"ai/output/merged_model-{CHECKPOINT}"

# base model 로드
print(f"Base model 로딩: {BASE_MODEL}")
base_model = AutoModelForCausalLM.from_pretrained(BASE_MODEL, torch_dtype=torch.float16).to("cuda")

# LoRA adapter 로드
print(f"LoRA adapter 로딩: {FINETUNED_MODEL_PATH}")
lora_model = PeftModel.from_pretrained(base_model, FINETUNED_MODEL_PATH, is_trainable=False)

# LoRA 병합 & 저장
print(f"병합 모델 저장: {MERGED_MODEL_PATH}")
lora_model.save_pretrained(MERGED_MODEL_PATH, merge_adapter=True)

print(f"병합된 모델이 {MERGED_MODEL_PATH} 에 저장되었습니다.")

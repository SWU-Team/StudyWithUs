import os
import sys
import traceback

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from transformers import TrainingArguments
from trl import SFTTrainer
from tokenizer_setup import get_tokenizer
from lora_setup import get_model
from dataset_loader import get_tokenized_dataset
from configs.training_config import get_training_arguments
from configs.lora_config import get_lora_config

def main():
    print("LLM 학습 시작")

    try:
        tokenizer = get_tokenizer()
        dataset = get_tokenized_dataset(tokenizer)
        model = get_model()
        training_args = get_training_arguments()

        trainer = SFTTrainer(
            model=model,
            train_dataset=dataset,
            args=training_args,
            peft_config=get_lora_config()
        )

        trainer.train(resume_from_checkpoint=True)
        print("학습 완료")

    except Exception as e:
        print("학습 도중 오류가 발생했습니다.")
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()
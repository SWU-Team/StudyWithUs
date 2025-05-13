import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))  # 상위 디렉토리(ai) 경로 추가

from train.dataset_loader import load_and_format_datasets
from train.tokenizer_setup import get_tokenizer

def main():
    print("데이터셋 크기 확인 중...")
    tokenizer = get_tokenizer()
    raw_dataset = load_and_format_datasets()

    print(f"\n통합 전 데이터셋 개수: {len(raw_dataset):,}개")

    # 샘플 출력
    print("\n샘플 1개:")
    print(raw_dataset[0]["text"])

if __name__ == "__main__":
    main()

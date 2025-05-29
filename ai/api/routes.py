from fastapi import APIRouter
from .schemas import PromptRequest, PromptResponse
from .llm_engine import infer

router = APIRouter()

@router.post("/predict", response_model=PromptResponse)
def predict(req: PromptRequest):
    result = infer(req.text)
    return {"response": result}
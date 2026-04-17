from fastapi import APIRouter
from typing import List
from models import Question, TestRequest, TestResponse
from personality_calculator import questions, calculate_result

router = APIRouter()

# 1. 只保留题目接口
@router.get("/questions", response_model=List[Question])
def get_questions():
    """获取测试题库"""
    return questions

# 2. 只保留测试提交接口，完全移除统计调用
@router.post("/test", response_model=TestResponse)
def submit_test(request: TestRequest):
    """提交测试答案，返回测试结果"""
    result = calculate_result(request.selected_options)
    return result

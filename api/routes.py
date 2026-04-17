from fastapi import APIRouter
from typing import List
from models import Question, TestRequest, TestResponse
from personality_calculator import questions, calculate_result

router = APIRouter()

# 题目接口（正常）
@router.get("/questions", response_model=List[Question])
def get_questions():
    return questions

# 测试接口（正常）
@router.post("/test", response_model=TestResponse)
def submit_test(request: TestRequest):
    result = calculate_result(request.selected_options)
    return result

# ==============================
# 以下是：绝对不崩溃的统计接口
# ==============================

# 内存统计（永远不会报错）
stats = {
    "page_views": 0,
    "unique_visitors": 0,
    "total_tests": 0,
    "test_results": {},
}

@router.post("/stats/page-view")
def page_view():
    stats["page_views"] += 1
    return {
        "page_views": stats["page_views"],
        "unique_visitors": 1,
        "session_id": "none"
    }

@router.get("/stats")
def get_stats():
    return stats

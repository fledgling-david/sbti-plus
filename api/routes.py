from fastapi import APIRouter, Request, Cookie
from typing import List
from models import Question, TestRequest, TestResponse
from personality_calculator import questions, calculate_result
import statistics
import uuid

router = APIRouter()

@router.get("/questions", response_model=List[Question])
def get_questions():
    """获取测试题库"""
    return questions

@router.post("/test", response_model=TestResponse)
def submit_test(request: TestRequest):
    """提交测试答案，返回测试结果"""
    result = calculate_result(request.selected_options)
    # 记录测试结果
    statistics.record_test_result(result.personality.name)
    return result

# 关键修复：改成用Cookie获取session_id，不用Request解析请求体
@router.post("/stats/page-view")
def record_page_view(request: Request):
    session_id = request.cookies.get("sbti_session_id")
    if not session_id:
        session_id = "default"
    
    stats = statistics.record_page_view(session_id)
    return {
        "page_views": stats["page_views"],
        "unique_visitors": stats["unique_visitors"],
        "session_id": session_id
    }

@router.get("/stats")
def get_statistics():
    stats = statistics.get_statistics()

    total = stats.get("total_tests", 0)
    percentages = {}

    for key, num in stats.get("test_results", {}).items():
        if total > 0:
            percentages[key] = round(num / total * 100, 2)
        else:
            percentages[key] = 0

    return {
        "page_views": stats.get("page_views", 0),
        "unique_visitors": stats.get("unique_visitors", 0),
        "total_tests": total,
        "test_results": stats.get("test_results", {}),
        "personality_percentages": percentages
    }

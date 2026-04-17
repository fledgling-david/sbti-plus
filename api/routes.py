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
        session_id = str(uuid.uuid4())

    stats = statistics.record_page_view(session_id)

    return {
        "page_views": stats["page_views"],
        "unique_visitors": stats["unique_visitors"],
        "session_id": session_id
    }

@router.get("/stats")
def get_statistics():
    stats = statistics.get_statistics()

    total_tests = stats["total_tests"]
    personality_percentages = {}

    for p, count in stats["test_results"].items():
        personality_percentages[p] = {
            "count": count,
            "percentage": round((count / total_tests) * 100, 2) if total_tests > 0 else 0
        }

    return {
        "page_views": stats["page_views"],
        "unique_visitors": stats["unique_visitors"],
        "total_tests": total_tests,
        "test_results": stats["test_results"],
        "personality_percentages": personality_percentages
    }

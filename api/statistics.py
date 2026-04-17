from typing import Dict, Optional

# 纯内存存储，永远不报错
_stats = {
    "page_views": 0,
    "unique_visitors": 0,
    "visitor_sessions": [],
    "test_results": {},
    "total_tests": 0
}

def record_page_view(session_id: Optional[str] = None) -> Dict:
    global _stats
    _stats["page_views"] += 1
    if session_id and session_id not in _stats["visitor_sessions"]:
        _stats["visitor_sessions"].append(session_id)
        _stats["unique_visitors"] = len(_stats["visitor_sessions"])
    return _stats

def record_test_result(personality: str):
    global _stats
    _stats["total_tests"] += 1
    _stats["test_results"][personality] = _stats["test_results"].get(personality, 0) + 1

def get_statistics() -> Dict:
    return _stats

from typing import Dict, Optional

# 内存存储（Vercel 无法写文件，只能用内存）
_stats = {
    "page_views": 0,
    "unique_visitors": 0,
    "visitor_sessions": [],
    "test_results": {},
    "total_tests": 0
}

def load_stats() -> Dict:
    return _stats

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
    if personality in _stats["test_results"]:
        _stats["test_results"][personality] += 1
    else:
        _stats["test_results"][personality] = 1

def get_statistics() -> Dict:
    return _stats

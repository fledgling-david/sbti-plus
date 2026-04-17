import json
from typing import Dict, Optional
from pathlib import Path

# 统计数据文件路径（只读，不写入）
DATA_FILE = Path(__file__).parent / "statistics_data.json"

# 默认统计数据结构
DEFAULT_STATS = {
    "page_views": 0,
    "unique_visitors": 0,
    "visitor_sessions": [],
    "test_results": {},
    "total_tests": 0
}

# 全局内存变量（只在当前函数实例中有效，重启后重置）
_stats_cache: Dict = None

def load_stats() -> Dict:
    """加载统计数据（只读）"""
    global _stats_cache
    if _stats_cache is not None:
        return _stats_cache
    
    # 优先读取文件中的初始数据
    if DATA_FILE.exists():
        try:
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                _stats_cache = json.load(f)
                return _stats_cache
        except Exception:
            pass
    
    # 文件不存在或读取失败，使用默认数据
    _stats_cache = DEFAULT_STATS.copy()
    return _stats_cache

def record_page_view(session_id: Optional[str] = None) -> Dict:
    """记录页面访问（只更新内存数据，不写入文件）"""
    stats = load_stats()
    
    # 增加页面访问量
    stats["page_views"] += 1
    
    # 处理独立访客
    if session_id:
        if session_id not in stats["visitor_sessions"]:
            stats["visitor_sessions"].append(session_id)
            stats["unique_visitors"] = len(stats["visitor_sessions"])
    
    return stats

def record_test_result(personality: str):
    """记录测试结果（只更新内存数据，不写入文件）"""
    stats = load_stats()
    
    # 增加测试总数
    stats["total_tests"] += 1
    
    # 记录人格结果
    if personality in stats["test_results"]:
        stats["test_results"][personality] += 1
    else:
        stats["test_results"][personality] = 1

def get_statistics() -> Dict:
    """获取完整统计数据"""
    return load_stats()

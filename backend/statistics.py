import json
import os
from typing import Dict, List, Optional
from pathlib import Path

# 统计数据文件路径
DATA_FILE = Path(__file__).parent / "statistics_data.json"

# 默认统计数据结构
DEFAULT_STATS = {
    "page_views": 0,
    "unique_visitors": 0,
    "visitor_sessions": [],
    "test_results": {},
    "total_tests": 0
}


def load_stats() -> Dict:
    """加载统计数据"""
    if not DATA_FILE.exists():
        return DEFAULT_STATS.copy()
    
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return DEFAULT_STATS.copy()


def save_stats(stats: Dict):
    """保存统计数据"""
    try:
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(stats, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"保存统计数据失败: {e}")


def record_page_view(session_id: Optional[str] = None) -> Dict:
    """记录页面访问"""
    stats = load_stats()
    
    # 增加页面访问量
    stats["page_views"] += 1
    
    # 处理独立访客
    if session_id:
        if session_id not in stats["visitor_sessions"]:
            stats["visitor_sessions"].append(session_id)
            stats["unique_visitors"] = len(stats["visitor_sessions"])
    
    save_stats(stats)
    return stats


def record_test_result(personality_name: str) -> Dict:
    """记录测试结果"""
    stats = load_stats()
    
    # 增加总测试数
    stats["total_tests"] += 1
    
    # 记录人格类型
    if personality_name not in stats["test_results"]:
        stats["test_results"][personality_name] = 0
    stats["test_results"][personality_name] += 1
    
    save_stats(stats)
    return stats


def get_statistics() -> Dict:
    """获取完整统计数据"""
    return load_stats()

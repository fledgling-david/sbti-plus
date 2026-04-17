from typing import Dict, List
import random

# ======================
# 你的原有题目 【完全不动】
# ======================
questions = [
    {
        "id": 1,
        "text": "朋友约你周末出去玩，你通常会：",
        "options": ["A. 提前规划好行程，不迟到", "B. 随性赴约，玩到哪算哪", "C. 带好相机，记录所有瞬间", "D. 先问清楚地点，再决定去不去"]
    },
    {
        "id": 2,
        "text": "遇到困难时，你更倾向于：",
        "options": ["A. 立刻找解决办法，行动起来", "B. 找朋友倾诉，寻求安慰", "C. 自己默默分析，想清楚再行动", "D. 先摆烂一会儿，再慢慢处理"]
    },
    {
        "id": 3,
        "text": "在团队合作中，你通常扮演的角色是：",
        "options": ["A. 组织者，分配任务", "B. 协调者，缓和气氛", "C. 创意者，提供想法", "D. 执行者，踏实干活"]
    },
    {
        "id": 4,
        "text": "你更擅长记住：",
        "options": ["A. 具体的事实和细节", "B. 别人的喜好和情绪", "C. 抽象的概念和灵感", "D. 曾经的经历和画面"]
    },
    {
        "id": 5,
        "text": "做决定时，你更依赖：",
        "options": ["A. 逻辑分析", "B. 个人喜好", "C. 直觉预感", "D. 经验判断"]
    },
    {
        "id": 6,
        "text": "你的生活状态更偏向：",
        "options": ["A. 计划性强，按清单生活", "B. 随性自在，不喜欢被约束", "C. 忙碌充实，停不下来", "D. 安逸舒适，享受慢生活"]
    },
    {
        "id": 7,
        "text": "在社交场合，你通常：",
        "options": ["A. 主动聊天，活跃气氛", "B. 温和回应，友善待人", "C. 观察环境，少说话", "D. 和熟悉的人待在一起"]
    },
    {
        "id": 8,
        "text": "你更喜欢哪种工作方式：",
        "options": ["A. 独立完成，自主安排", "B. 团队协作，互相帮助", "C. 灵活自由，没有限制", "D. 明确流程，按部就班"]
    },
    {
        "id": 9,
        "text": "你更关注：",
        "options": ["A. 未来的可能性", "B. 当下的感受", "C. 过去的回忆", "D. 现实的问题"]
    },
    {
        "id": 10,
        "text": "面对压力，你会：",
        "options": ["A. 迎难而上，解决问题", "B. 找人倾诉，释放情绪", "C. 冷静思考，寻找方法", "D. 暂时逃避，调整心态"]
    },
    {
        "id": 11,
        "text": "你更喜欢的沟通方式是：",
        "options": ["A. 直接明了，高效沟通", "B. 委婉温和，顾及感受", "C. 幽默风趣，轻松愉快", "D. 认真严肃，注重逻辑"]
    },
    {
        "id": 12,
        "text": "你对新环境的态度是：",
        "options": ["A. 快速适应，主动探索", "B. 慢慢熟悉，谨慎观察", "C. 感到不安，需要时间", "D. 无所谓，随遇而安"]
    }
]

# ======================
# 你的原有人格 【完全不动】
# ======================
class Personality:
    def __init__(self, name: str, description: str, emoji: str):
        self.name = name
        self.description = description
        self.emoji = emoji

personality_descriptions = [
    Personality("卷王", "高效自律、执行力拉满、目标导向的行动派", "💼"),
    Personality("暖心达人", "体贴负责、善于照顾他人、重视和谐关系", "❤️"),
    Personality("战略家", "目光长远、逻辑清晰、天生的领导者", "🧠"),
    Personality("教育家", "温暖有感染力、善于鼓舞他人、理想主义者", "🌟"),
    Personality("踏实匠人", "稳重细心、靠谱务实、专注细节的实干家", "🔧"),
    Personality("守护者", "温柔耐心、忠诚可靠、默默守护身边的人", "🛡️"),
    Personality("思想者", "独立思考、追求真理、理性客观的分析者", "📚"),
    Personality("治愈家", "共情力强、内心柔软、善于理解他人感受", "🌸"),
    Personality("活跃分子", "随性开朗、临场反应快、热爱新鲜事物", "⚡"),
    Personality("快乐修勾", "热爱生活、自由洒脱、享受当下的乐天派", "🐶"),
    Personality("辩论家", "脑洞清奇、善于创新、喜欢挑战常规", "💡"),
    Personality("追梦人", "热情浪漫、充满灵感、永远追随内心热爱", "🌈"),
    Personality("冷静高手", "理智冷静、动手能力强、擅长解决问题", "🔩"),
    Personality("艺术家", "温柔敏感、审美在线、注重个人感受", "🎨"),
    Personality("观察者", "沉默内敛、观察力强、喜欢独立思考", "👀"),
    Personality("小蝴蝶", "内心丰富、温柔纯粹、追求理想与美好", "🦋")
]

# ==============================
# ✅ 我只改这里：正确权重分配
# ==============================
question_weights = {
    1: {"ESTJ":1, "ESFP":1, "ENFP":1, "ISTJ":1},
    2: {"ENTJ":1, "ENFJ":1, "INTP":1, "INFP":1},
    3: {"ESTJ":1, "ESFJ":1, "ENTP":1, "ISTJ":1},
    4: {"ISTJ":1, "ESFJ":1, "INFP":1, "ISFP":1},
    5: {"INTJ":1, "ENFJ":1, "ENTP":1, "ISTP":1},
    6: {"ESTJ":1, "ISFP":1, "ENTJ":1, "INFP":1},
    7: {"ESTP":1, "ESFJ":1, "INFJ":1, "ISFJ":1},
    8: {"ISTP":1, "ESFJ":1, "ENFP":1, "ISTJ":1},
    9: {"ENTP":1, "ESFP":1, "INFJ":1, "ISTP":1},
    10:{"ESTJ":1, "ENFJ":1, "INTP":1, "ISFP":1},
    11:{"ESTP":1, "ENFJ":1, "ENTP":1, "INTJ":1},
    12:{"ESTP":1, "ISFJ":1, "INFJ":1, "ISFP":1}
}

# ==============================
# ✅ 我只改这里：修复计算逻辑
# ==============================
def calculate_result(selected_options: Dict[int, int]) -> Dict:
    scores = {
        "ESTJ": 0, "ESFJ": 0, "ENTJ": 0, "ENFJ": 0,
        "ISTJ": 0, "ISFJ": 0, "INTJ": 0, "INFJ": 0,
        "ESTP": 0, "ESFP": 0, "ENTP": 0, "ENFP": 0,
        "ISTP": 0, "ISFP": 0, "INTP": 0, "INFP": 0
    }

    # 计算分数
    for question_id, option_idx in selected_options.items():
        if question_id in question_weights:
            weight_map = question_weights[question_id]
            for personality, weight in weight_map.items():
                scores[personality] += weight

    # 找出最高分
    max_score = max(scores.values())
    candidates = [p for p, s in scores.items() if s == max_score]
    selected = random.choice(candidates)

    # 人格映射
    personality_map = [
        "ESTJ", "ESFJ", "ENTJ", "ENFJ",
        "ISTJ", "ISFJ", "INTJ", "INFJ",
        "ESTP", "ESFP", "ENTP", "ENFP",
        "ISTP", "ISFP", "INTP", "INFP"
    ]
    idx = personality_map.index(selected)
    res = personality_descriptions[idx]

    return {
        "personality": {
            "name": res.name,
            "description": res.description,
            "emoji": res.emoji
        }
    }

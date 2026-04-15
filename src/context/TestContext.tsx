import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// 题目类型定义
export interface Question {
  id: number;
  text: string;
  options: {
    text: string;
    weights: {
      卷王: number;
      脆皮: number;
      缝合怪: number;
      乐子人: number;
      纯爱战神: number;
      网抑云患者: number;
      社交牛杂症: number;
      摸鱼大师: number;
    };
  }[];
}

// 人格类型定义
export interface Personality {
  name: string;
  symbol: string;
  description: string;
  color: string;
  comment: string;
}

// 测试结果类型定义
export interface TestResult {
  personality: Personality;
  scores: {
    [key: string]: number;
  };
}

// Context类型定义
interface TestContextType {
  questions: Question[];
  currentQuestionIndex: number;
  selectedOptions: number[];
  isTestCompleted: boolean;
  testResult: TestResult | null;
  isLoading: boolean;
  error: string | null;
  selectOption: (optionIndex: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  resetTest: () => void;
  completeTest: () => Promise<void>;
}

// 创建Context
const TestContext = createContext<TestContextType | undefined>(undefined);

// API基础URL
const API_BASE_URL = 'https://sbti-plus-ab76.vercel.app/api';

// 模拟题库数据（作为 fallback）
const mockQuestions: Question[] = [
  {
    id: 1,
    text: '周末休息时，你最喜欢的活动是？',
    options: [
      {
        text: '加班或学习新技能',
        weights: { 卷王: 3, 脆皮: -1, 缝合怪: 1, 乐子人: -1, 纯爱战神: 0, 网抑云患者: -1, 社交牛杂症: 0, 摸鱼大师: -2 }
      },
      {
        text: '在家躺着刷手机',
        weights: { 卷王: -2, 脆皮: 2, 缝合怪: 0, 乐子人: 1, 纯爱战神: 0, 网抑云患者: 1, 社交牛杂症: -1, 摸鱼大师: 3 }
      },
      {
        text: '和朋友出去聚会',
        weights: { 卷王: -1, 脆皮: 0, 缝合怪: 1, 乐子人: 3, 纯爱战神: 1, 网抑云患者: -1, 社交牛杂症: 3, 摸鱼大师: -1 }
      }
    ]
  },
  {
    id: 2,
    text: '当你遇到工作/学习压力时，你会？',
    options: [
      {
        text: '加倍努力，一定要完成目标',
        weights: { 卷王: 3, 脆皮: -2, 缝合怪: 1, 乐子人: -1, 纯爱战神: 0, 网抑云患者: -2, 社交牛杂症: 0, 摸鱼大师: -3 }
      },
      {
        text: '感到焦虑，甚至崩溃',
        weights: { 卷王: -1, 脆皮: 3, 缝合怪: 0, 乐子人: -1, 纯爱战神: 0, 网抑云患者: 3, 社交牛杂症: -1, 摸鱼大师: 1 }
      },
      {
        text: '先摸鱼放松一下，再慢慢解决',
        weights: { 卷王: -2, 脆皮: 0, 缝合怪: 1, 乐子人: 2, 纯爱战神: 0, 网抑云患者: -1, 社交牛杂症: 1, 摸鱼大师: 3 }
      }
    ]
  },
  {
    id: 3,
    text: '你如何看待社交媒体？',
    options: [
      {
        text: '用来展示自己的成就和生活',
        weights: { 卷王: 2, 脆皮: 0, 缝合怪: 1, 乐子人: -1, 纯爱战神: 1, 网抑云患者: -1, 社交牛杂症: 2, 摸鱼大师: -1 }
      },
      {
        text: '用来发泄情绪，分享负面内容',
        weights: { 卷王: -1, 脆皮: 2, 缝合怪: 0, 乐子人: -1, 纯爱战神: -1, 网抑云患者: 3, 社交牛杂症: -1, 摸鱼大师: 1 }
      },
      {
        text: '用来吃瓜和看乐子',
        weights: { 卷王: -2, 脆皮: -1, 缝合怪: 1, 乐子人: 3, 纯爱战神: 0, 网抑云患者: -2, 社交牛杂症: 1, 摸鱼大师: 2 }
      }
    ]
  },
  {
    id: 4,
    text: '当你和朋友发生分歧时，你会？',
    options: [
      {
        text: '据理力争，一定要说服对方',
        weights: { 卷王: 3, 脆皮: -1, 缝合怪: 0, 乐子人: -1, 纯爱战神: 1, 网抑云患者: -1, 社交牛杂症: 2, 摸鱼大师: -2 }
      },
      {
        text: '感到受伤，不再主动联系',
        weights: { 卷王: -1, 脆皮: 3, 缝合怪: 0, 乐子人: -1, 纯爱战神: 2, 网抑云患者: 3, 社交牛杂症: -2, 摸鱼大师: 0 }
      },
      {
        text: '打哈哈，转移话题，避免冲突',
        weights: { 卷王: -2, 脆皮: 0, 缝合怪: 2, 乐子人: 2, 纯爱战神: -1, 网抑云患者: -1, 社交牛杂症: 3, 摸鱼大师: 2 }
      }
    ]
  },
  {
    id: 5,
    text: '你对恋爱的态度是？',
    options: [
      {
        text: '认真对待，追求纯粹的爱情',
        weights: { 卷王: 0, 脆皮: 1, 缝合怪: -1, 乐子人: -2, 纯爱战神: 3, 网抑云患者: 1, 社交牛杂症: 0, 摸鱼大师: -1 }
      },
      {
        text: '随缘，不刻意追求',
        weights: { 卷王: -1, 脆皮: 0, 缝合怪: 1, 乐子人: 1, 纯爱战神: -1, 网抑云患者: -1, 社交牛杂症: 1, 摸鱼大师: 2 }
      },
      {
        text: '觉得恋爱麻烦，不如搞钱',
        weights: { 卷王: 3, 脆皮: -1, 缝合怪: 0, 乐子人: 1, 纯爱战神: -2, 网抑云患者: -1, 社交牛杂症: 0, 摸鱼大师: 1 }
      }
    ]
  },
  {
    id: 6,
    text: '你如何度过一个人的夜晚？',
    options: [
      {
        text: '学习或工作到深夜',
        weights: { 卷王: 3, 脆皮: -1, 缝合怪: 1, 乐子人: -1, 纯爱战神: 0, 网抑云患者: -1, 社交牛杂症: -1, 摸鱼大师: -2 }
      },
      {
        text: '听悲伤的音乐，思考人生',
        weights: { 卷王: -1, 脆皮: 2, 缝合怪: 0, 乐子人: -2, 纯爱战神: 1, 网抑云患者: 3, 社交牛杂症: -1, 摸鱼大师: 0 }
      },
      {
        text: '打游戏或看剧，放松自己',
        weights: { 卷王: -2, 脆皮: 0, 缝合怪: 1, 乐子人: 3, 纯爱战神: -1, 网抑云患者: -1, 社交牛杂症: 0, 摸鱼大师: 3 }
      }
    ]
  },
  {
    id: 7,
    text: '你对未来的规划是？',
    options: [
      {
        text: '制定详细计划，努力实现目标',
        weights: { 卷王: 3, 脆皮: -1, 缝合怪: 1, 乐子人: -1, 纯爱战神: 0, 网抑云患者: -2, 社交牛杂症: 0, 摸鱼大师: -3 }
      },
      {
        text: '走一步看一步，不想太多',
        weights: { 卷王: -2, 脆皮: 1, 缝合怪: 0, 乐子人: 2, 纯爱战神: 0, 网抑云患者: 1, 社交牛杂症: 1, 摸鱼大师: 3 }
      },
      {
        text: '希望找到真爱，组建家庭',
        weights: { 卷王: -1, 脆皮: 0, 缝合怪: -1, 乐子人: -1, 纯爱战神: 3, 网抑云患者: 1, 社交牛杂症: 0, 摸鱼大师: -1 }
      }
    ]
  },
  {
    id: 8,
    text: '你如何看待加班？',
    options: [
      {
        text: '加班是常态，为了更好的未来',
        weights: { 卷王: 3, 脆皮: -2, 缝合怪: 1, 乐子人: -2, 纯爱战神: 0, 网抑云患者: -2, 社交牛杂症: 0, 摸鱼大师: -3 }
      },
      {
        text: '偶尔加班可以接受，经常加班会崩溃',
        weights: { 卷王: -1, 脆皮: 3, 缝合怪: 0, 乐子人: 0, 纯爱战神: 0, 网抑云患者: 2, 社交牛杂症: 1, 摸鱼大师: 1 }
      },
      {
        text: '能摸鱼就摸鱼，拒绝无效加班',
        weights: { 卷王: -3, 脆皮: 0, 缝合怪: 1, 乐子人: 2, 纯爱战神: 0, 网抑云患者: -1, 社交牛杂症: 1, 摸鱼大师: 3 }
      }
    ]
  },
  {
    id: 9,
    text: '你最喜欢的网络梗类型是？',
    options: [
      {
        text: '职场内卷相关',
        weights: { 卷王: 3, 脆皮: -1, 缝合怪: 1, 乐子人: 0, 纯爱战神: -1, 网抑云患者: -1, 社交牛杂症: 0, 摸鱼大师: -2 }
      },
      {
        text: 'emo情绪相关',
        weights: { 卷王: -1, 脆皮: 2, 缝合怪: 0, 乐子人: -1, 纯爱战神: 1, 网抑云患者: 3, 社交牛杂症: -1, 摸鱼大师: 0 }
      },
      {
        text: '搞笑整活相关',
        weights: { 卷王: -2, 脆皮: -1, 缝合怪: 1, 乐子人: 3, 纯爱战神: -1, 网抑云患者: -2, 社交牛杂症: 2, 摸鱼大师: 2 }
      }
    ]
  },
  {
    id: 10,
    text: '当你完成一件重要的事情后，你会？',
    options: [
      {
        text: '立即开始下一个目标',
        weights: { 卷王: 3, 脆皮: -1, 缝合怪: 1, 乐子人: -1, 纯爱战神: 0, 网抑云患者: -2, 社交牛杂症: 0, 摸鱼大师: -3 }
      },
      {
        text: '感到空虚，不知道接下来做什么',
        weights: { 卷王: -1, 脆皮: 2, 缝合怪: 0, 乐子人: -1, 纯爱战神: 1, 网抑云患者: 3, 社交牛杂症: -1, 摸鱼大师: 0 }
      },
      {
        text: '好好放松一下，奖励自己',
        weights: { 卷王: -2, 脆皮: 0, 缝合怪: 1, 乐子人: 2, 纯爱战神: 1, 网抑云患者: -1, 社交牛杂症: 2, 摸鱼大师: 3 }
      }
    ]
  }
];

// Provider组件
export const TestProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<number[]>(Array(mockQuestions.length).fill(-1));
  const [isTestCompleted, setIsTestCompleted] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 加载题库数据
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_BASE_URL}/questions`);
        if (response.ok) {
          const data = await response.json();
          setQuestions(data);
          setSelectedOptions(Array(data.length).fill(-1));
        } else {
          // 使用模拟数据作为 fallback
          console.warn('Failed to load questions from API, using mock data');
        }
      } catch (err) {
        console.error('Error loading questions:', err);
        // 使用模拟数据作为 fallback
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, []);

  const selectOption = (optionIndex: number) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[currentQuestionIndex] = optionIndex;
    setSelectedOptions(newSelectedOptions);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const resetTest = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptions(Array(questions.length).fill(-1));
    setIsTestCompleted(false);
    setTestResult(null);
    setError(null);
  };

  const completeTest = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // 调用后端API计算结果
      const response = await fetch(`${API_BASE_URL}/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selected_options: selectedOptions }),
      });

      if (response.ok) {
        const data = await response.json();
        setTestResult(data);
        setIsTestCompleted(true);
      } else {
        // 后端计算失败，使用前端计算作为 fallback
        console.warn('Failed to get result from API, using frontend calculation');
        // 简单的前端计算逻辑
        const scores: { [key: string]: number } = {
          '卷王': 0,
          '脆皮': 0,
          '缝合怪': 0,
          '乐子人': 0,
          '纯爱战神': 0,
          '网抑云患者': 0,
          '社交牛杂症': 0,
          '摸鱼大师': 0
        };

        selectedOptions.forEach((optionIndex, questionIndex) => {
          if (optionIndex >= 0 && optionIndex < questions[questionIndex].options.length) {
            const option = questions[questionIndex].options[optionIndex];
            Object.entries(option.weights).forEach(([personality, weight]) => {
              scores[personality] += weight;
            });
          }
        });

        const highestScorePersonality = Object.entries(scores).reduce((a, b) => scores[a[0]] > scores[b[0]] ? a : b)[0];
        
        // 生成简单的人格结果
        const personality = {
          name: highestScorePersonality,
          symbol: '👤',
          description: '赛博人格',
          color: '#FF00FF',
          comment: '根据你的回答，你是一个独特的赛博人格。'
        };

        setTestResult({ personality, scores });
        setIsTestCompleted(true);
      }
    } catch (err) {
      console.error('Error completing test:', err);
      setError('计算结果时出错，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue: TestContextType = {
    questions,
    currentQuestionIndex,
    selectedOptions,
    isTestCompleted,
    testResult,
    isLoading,
    error,
    selectOption,
    nextQuestion,
    previousQuestion,
    resetTest,
    completeTest
  };

  return (
    <TestContext.Provider value={contextValue}>
      {children}
    </TestContext.Provider>
  );
};

// 自定义Hook
export const useTest = () => {
  const context = useContext(TestContext);
  if (context === undefined) {
    throw new Error('useTest must be used within a TestProvider');
  }
  return context;
};
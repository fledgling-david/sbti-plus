import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface StatisticsData {
  page_views: number;
  unique_visitors: number;
  total_tests: number;
  test_results: Record<string, number>;
  personality_percentages: Record<string, { count: number; percentage: number }>;
}

interface StatisticsPageProps {
  onBack: () => void;
}

const personalityColors: Record<string, string> = {
  '卷王': '#FF00FF',
  '脆皮': '#00FFFF',
  '缝合怪': '#00FF00',
  '乐子人': '#FFFF00',
  '纯爱战神': '#FF69B4',
  '网抑云患者': '#87CEEB',
  '社交牛杂症': '#FFA500',
  '摸鱼大师': '#20B2AA'
};

const StatisticsPage: React.FC<StatisticsPageProps> = ({ onBack }) => {
  const [stats, setStats] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('获取统计数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="neobrutal-container flex items-center justify-center min-h-screen">
        <div className="neobrutal-card p-8">
          <div className="text-center">
            <div className="text-4xl animate-spin">⏳</div>
            <p className="mt-4 font-bold text-lg">加载统计数据中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="neobrutal-container flex items-center justify-center min-h-screen">
        <div className="neobrutal-card p-8">
          <div className="text-center">
            <p className="font-bold text-lg mb-4">获取统计数据失败</p>
            <button className="neobrutal-button" onClick={fetchStatistics}>
              重试
            </button>
          </div>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: Object.keys(stats.test_results),
    datasets: [
      {
        data: Object.values(stats.test_results),
        backgroundColor: Object.keys(stats.test_results).map(name => personalityColors[name] || '#999999'),
        borderColor: '#000000',
        borderWidth: 3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: {
            family: 'Fredoka One, cursive',
            size: 14,
            weight: 'bold' as const
          },
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const personality = context.label;
            const percentage = stats.personality_percentages[personality]?.percentage || 0;
            return `${personality}: ${context.parsed}人 (${percentage}%)`;
          }
        }
      }
    },
  };

  return (
    <div className="neobrutal-container">
      <div className="w-full max-w-4xl mx-auto">
        {/* 返回按钮 */}
        <div className="mb-8">
          <button 
            className="neobrutal-button text-lg flex items-center gap-2"
            onClick={onBack}
          >
            <span>←</span> 返回首页
          </button>
        </div>

        {/* 页面标题 */}
        <div className="neobrutal-card text-center mb-8">
          <h1 className="neobrutal-title text-3xl">📊 数据统计</h1>
        </div>

        {/* 访问统计卡片 */}
        <div className="neobrutal-card mb-8">
          <h2 className="neobrutal-subtitle mb-6 flex items-center">
            <span className="mr-2">👀</span> 页面访问统计
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="neobrutal-card p-6 bg-[#E8F0FE] text-center">
              <div className="text-4xl mb-2">📈</div>
              <div className="text-3xl font-black mb-2">{stats.page_views}</div>
              <div className="font-bold opacity-80">总页面浏览量</div>
            </div>
            <div className="neobrutal-card p-6 bg-[#E8F0FE] text-center">
              <div className="text-4xl mb-2">👥</div>
              <div className="text-3xl font-black mb-2">{stats.unique_visitors}</div>
              <div className="font-bold opacity-80">独立访客数</div>
            </div>
          </div>
        </div>

        {/* 测试统计卡片 */}
        <div className="neobrutal-card mb-8">
          <h2 className="neobrutal-subtitle mb-6 flex items-center">
            <span className="mr-2">🧪</span> 测试完成统计
          </h2>
          <div className="neobrutal-card p-6 bg-[#E8F0FE] text-center mb-6">
            <div className="text-4xl mb-2">✅</div>
            <div className="text-4xl font-black mb-2">{stats.total_tests}</div>
            <div className="font-bold opacity-80">总完成测试人数</div>
          </div>

          {/* 人格类型分布描述 */}
          {stats.total_tests > 0 && (
            <div className="space-y-4 mb-8">
              <h3 className="font-black text-lg">人格类型分布详情</h3>
              {Object.entries(stats.personality_percentages).map(([name, data]) => (
                <div 
                  key={name}
                  className="neobrutal-card p-4"
                  style={{ borderColor: personalityColors[name] }}
                >
                  <p className="font-bold">
                    在总共{stats.total_tests}名测试者中，有{data.count}人属于「{name}」，占比{data.percentage}%
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* 扇形统计图 */}
          {stats.total_tests > 0 && (
            <div>
              <h3 className="font-black text-lg mb-4">📊 人格类型分布图表</h3>
              <div className="neobrutal-card p-6">
                <div className="w-full max-w-lg mx-auto">
                  <Doughnut data={chartData} options={chartOptions} />
                </div>
              </div>
            </div>
          )}

          {stats.total_tests === 0 && (
            <div className="neobrutal-card p-6 text-center">
              <div className="text-4xl mb-4">📭</div>
              <p className="font-bold opacity-80">还没有测试数据，快来成为第一个测试者吧！</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;

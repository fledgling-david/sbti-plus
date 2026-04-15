import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { useTest } from '../context/TestContext';

interface ResultPageProps {
  onRestart: () => void;
}

const ResultPage: React.FC<ResultPageProps> = ({ onRestart }) => {
  const { testResult, resetTest } = useTest();

  const [statistics, setStatistics] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [isGeneratingPoster, setIsGeneratingPoster] = useState(false);
  const resultPageRef = useRef<HTMLDivElement>(null);

  if (!testResult) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="neobrutal-card p-8">
          <div className="text-center">
            <h2 className="neobrutal-title">测试结果未生成</h2>
            <button className="neobrutal-button" onClick={onRestart}>
              重新测试
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { personality } = testResult;

  const handleShare = (platform: string) => {
    const shareText = `我在SBTI测试中被评为${personality.symbol}${personality.name}！${personality.comment}`;
    
    switch (platform) {
      case 'wechat':
        alert('请复制以下内容分享到朋友圈：\n' + shareText);
        break;
      case 'weibo':
        window.open(`https://service.weibo.com/share/share.php?url=https://sbti-test.com&title=${encodeURIComponent(shareText)}`);
        break;
      case 'copy':
        navigator.clipboard.writeText(shareText);
        alert('复制成功！');
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch('https://sbti-plus-ab76.vercel.app/api/stats');
        const data = await response.json();
        setStatistics(data);
      } catch (error) {
        console.error('获取统计数据失败:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStatistics();
  }, []);



  const handleGeneratePoster = async () => {
    if (!resultPageRef.current) return;
    
    setIsGeneratingPoster(true);
    
    try {
      // 找到分享功能部分，只截图到分享结果前的部分
      const shareSection = resultPageRef.current.querySelector('.mt-12:nth-of-type(3)') as HTMLElement;
      
      let height = resultPageRef.current.scrollHeight;
      if (shareSection) {
        // 计算只到分享结果前的高度
        height = shareSection.offsetTop;
      }

      const canvas = await html2canvas(resultPageRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#E8F0FE',
        logging: false,
        height: height,
        y: 0,
      });

      const confirmExport = confirm('海报已生成，是否导出为图片？');
      
      if (confirmExport) {
        const fileName = `SBTI-result-${testResult.personality.name}-${Date.now()}`;
        const link = document.createElement('a');
        link.download = `${fileName}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    } catch (error) {
      console.error('生成海报失败:', error);
      alert('生成海报失败，请重试');
    } finally {
      setIsGeneratingPoster(false);
    }
  };



  return (
    <div className="neobrutal-container">
      <div ref={resultPageRef} className="neobrutal-card neobrutal-animate-bounce">
        {/* 测试结果 */}
        <div className="mt-8">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', width: '100%' }}>
            <div style={{ fontSize: '60px', marginRight: '20px', display: 'inline-block' }}>{personality.symbol}</div>
            <div style={{ flex: '1', maxWidth: '400px', display: 'inline-block' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 4px 0' }}>
                {personality.name}
              </h1>
              <p style={{ fontSize: '16px', margin: '0' }}>{personality.description}</p>
            </div>
          </div>
          <div className="mb-8">
            <div className="neobrutal-card p-6 max-w-2xl mx-auto">
              <p className="text-left">{personality.comment}</p>
            </div>
          </div>

          {/* 统计数据显示 */}
          <div className="mt-16" style={{ marginTop: '64px' }}>
            <h2 className="neobrutal-title">📊 测试数据</h2>
            <div className="neobrutal-card p-6 bg-[#E8F0FE]">
              {loadingStats ? (
                <div className="text-center">
                  <div className="text-2xl animate-spin">⏳</div>
                  <p className="mt-2 font-bold">加载数据中...</p>
                </div>
              ) : statistics ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {/* 核心数据指标 - 测试人数和用户人格 */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', width: '100%' }}>
                    <div className="neobrutal-card p-4 text-center" style={{ margin: 0 }}>
                      <div className="text-3xl font-black mb-2">{statistics.total_tests}</div>
                      <div className="font-bold opacity-80">测试人数</div>
                    </div>
                    <div className="neobrutal-card p-4 text-center" style={{ margin: 0 }}>
                      <div className="text-3xl font-black mb-2">{personality.symbol} {personality.name}</div>
                      <div className="font-bold opacity-80">你的人格</div>
                    </div>
                  </div>

                  {/* 人格类型分布 */}
                  {statistics.personality_percentages && Object.entries(statistics.personality_percentages).length > 0 && (
                    <div>
                      <h3 className="font-black mb-4">人格类型分布</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%' }}>
                        {Object.entries(statistics.personality_percentages).map(([name, data]) => (
                          <div key={name} className="neobrutal-card p-3" style={{ margin: 0 }}>
                            <div className="font-bold text-sm mb-1">{name}</div>
                            <div className="text-lg font-black">{((data as any).percentage)}%</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <p className="font-bold">获取数据失败</p>
                </div>
              )}
            </div>
          </div>

          {/* 分享和操作按钮 */}
          <div className="mt-16" style={{ marginTop: '64px', marginBottom: '64px' }}>
            <h2 className="neobrutal-title">🐖 分享结果 or 重启人格</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <button className="neobrutal-button flex items-center button-copy" onClick={() => handleShare('copy')}>
                <span className="mr-2">📋</span> 复制文案
              </button>
              <button className="neobrutal-button flex items-center button-poster" onClick={handleGeneratePoster} disabled={isGeneratingPoster}>
                <span className="mr-2">
                  {isGeneratingPoster ? (
                    <span className="animate-spin">⏳</span>
                  ) : (
                    '📸'
                  )}
                </span>
                {isGeneratingPoster ? '生成中...' : '生成海报'}
              </button>
              <button 
                className="neobrutal-button flex items-center button-restart"
                onClick={() => {
                  resetTest();
                  onRestart();
                }}
              >
                <span className="mr-2">🔄</span> 重新测试
              </button>
            </div>
          </div>
        </div>
      </div>
       {/* 结尾GIF区域 */}
          
            <div >
              <div className="gif-container relative w-full max-w-3xl mx-auto">
                <img 
                  src="/ending.gif" 
                  alt="结尾GIF" 
                  className="gif-image border-3 border-black rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Crect width='600' height='400' fill='%23f0f0f0' stroke='%23000' stroke-width='3'/%3E%3Ctext x='50%25' y='40%25' font-family='Arial' font-size='24' font-weight='bold' text-anchor='middle' dominant-baseline='middle'%3E结尾动画%3C/text%3E%3Ctext x='50%25' y='60%25' font-family='Arial' font-size='14' text-anchor='middle' dominant-baseline='middle'%3E请将ending.gif放到public目录下%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
            </div>
          
      {/* 页脚 */}
      <div className="mt-12 text-center text-sm">
        <p>© 2026 广东阿伟的SBTI二创 | 仅供娱乐，请勿当真</p>
      </div>
    </div>
  );
};

export default ResultPage;
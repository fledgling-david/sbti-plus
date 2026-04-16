import React, { useState, useEffect, useRef } from 'react';

interface WelcomePageProps {
  onStartTest: () => void;
  onViewStatistics: () => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ onStartTest }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [loadingStage, setLoadingStage] = useState(0);
  const [crazyText, setCrazyText] = useState('人类哪有不发疯的？硬撑罢了…');
  const [textIndex, setTextIndex] = useState(0);
  const progressContainerRef = useRef<HTMLDivElement>(null);

  const loadingMessages = [
    '正在初始化测试系统...',
    '加载人格分析模型...',
    '准备问题数据库...',
    '优化用户体验...',
    '即将完成!'
  ];

  // 发疯文学短语集 - 20条
  const crazyLiteraturePhrases = [
    '人类哪有不发疯的？硬撑罢了…',
    '我精神状态很好啊！只是有点疯而已…',
    '上班而已，不要命的…',
    '这个班，谁爱上谁上吧…',
    '我的精神状态：时而正常，时而更不正常…',
    '别问，问就是在发疯的边缘…',
    '人生嘛，不疯一下怎么知道自己活过…',
    '发疯使人快乐，真的…',
    '我没疯，只是这个世界疯了…',
    '每天都在发疯的边缘反复横跳…',
    '疯就疯吧，反正这个世界也没好到哪里去…',
    '精神状态：已疯，勿扰…',
    '发疯是成年人的基本生存技能…',
    '我疯起来连我自己都怕…',
    '这个世界已经够疯了，不差我一个…',
    '别管我，让我一个人疯一会儿…',
    '发疯文学，才是成年人的真实写照…',
    '疯言疯语，才是真心话…',
    '我不发疯，我只是在释放天性…',
    '生活已经够苦了，疯一下怎么了…'
  ];

  // 获取不重复的随机短语
  const getRandomPhrases = (count: number, excludePhrases: string[] = []): string[] => {
    const available = crazyLiteraturePhrases.filter(p => !excludePhrases.includes(p));
    const result: string[] = [];
    
    for (let i = 0; i < count && available.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * available.length);
      result.push(available[randomIndex]);
      available.splice(randomIndex, 1);
    }
    
    return result;
  };

  useEffect(() => {
    // 记录页面访问
    const recordPageView = async () => {
      try {
        const response = await fetch('/api/stats/page-view', {
          method: 'POST',
        });
        const data = await response.json();
        
        // 设置session cookie
        if (data.session_id) {
          document.cookie = `sbti_session_id=${data.session_id}; path=/; max-age=31536000`;
        }
      } catch (error) {
        console.error('记录页面访问失败:', error);
      }
    };

    recordPageView();

    let stageTimer: number;
    let crazyTextTimer: number;
    
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          clearInterval(stageTimer);
          clearTimeout(crazyTextTimer);
          setTimeout(() => setIsLoading(false), 800);
          return 100;
        }
        
        const increment = prev < 30 ? Math.random() * 3 + 2 :
                         prev < 70 ? Math.random() * 2.5 + 1.5 :
                         Math.random() * 1.5 + 0.5;
        
        return Math.min(prev + increment, 100);
      });
    }, 80);

    stageTimer = setInterval(() => {
      setLoadingStage((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);

    // 发疯文学轮播逻辑
    const runCrazyTextRotation = () => {
      const phrases = getRandomPhrases(3);
      let currentIndex = 0;
      
      // 快速显示3个短语（每个333ms）
      const showPhrases = () => {
        if (currentIndex < 3) {
          setCrazyText(phrases[currentIndex]);
          setTextIndex(currentIndex);
          currentIndex++;
          crazyTextTimer = setTimeout(showPhrases, 333);
        } else {
          // 第3个短语停留1秒
          crazyTextTimer = setTimeout(() => {
            runCrazyTextRotation(); // 重新开始循环
          }, 1000);
        }
      };
      
      showPhrases();
    };
    
    runCrazyTextRotation();

    return () => {
      clearInterval(progressTimer);
      clearInterval(stageTimer);
      clearTimeout(crazyTextTimer);
    };
  }, []);

  // Trae优化：狗头位置+动画 - 精确位置计算函数


  if (isLoading) {
    return (
      <div className="loading-page-container">
        <div className="neobrutal-card loading-card">
          {/* 修复：使用flex布局实现垂直居中，垂直间距24px */}
          <div className="flex flex-col items-center" style={{ gap: '24px' }}>
            {/* 修复：标题32px，水平居中 */}
            <div 
              className="w-full text-center"
              style={{
                width: '100%',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <div className="mb-4 neobrutal-animate-bounce dog-icon-container">
                <img 
                  src="/狗头.gif" 
                  alt="狗头图标" 
                  className="w-20 h-20 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              <h2 
                className="font-black mb-2 text-center" 
                style={{ 
                  fontSize: '32px',
                  textAlign: 'center',
                  width: '100%',
                  display: 'block',
                  marginLeft: 'auto',
                  marginRight: 'auto'
                }}
              >
                SBTI
              </h2>
              <p 
                className="font-bold text-primary-color text-center" 
                style={{ 
                  fontSize: '20px',
                  textAlign: 'center',
                  width: '100%',
                  display: 'block',
                  marginLeft: 'auto',
                  marginRight: 'auto'
                }}
              >
                人格测试
              </p>
            </div>

            {/* 进度条容器 */}
            <div 
              ref={progressContainerRef}
              className="neobrutal-progress-container w-full relative"
            >
            
              <div className="neobrutal-progress w-full">
                <div 
                  className={`neobrutal-progress-bar flex items-center justify-center ${progress >= 99 ? 'progress-bar-complete' : ''}`}
                  style={{ 
                    width: `${Math.min(progress, 100)}%`,
                    fontSize: '20px'
                  }}
                >
                  <span className="progress-text">{Math.round(progress)}%</span>
                </div>
              </div>
            </div>

            {/* 修复：加载提示20px，水平居中 */}
            <div className="min-h-[32px] w-full text-center">
              <p className="font-bold text-center animate-pulse" style={{ fontSize: '20px' }}>
                {loadingMessages[loadingStage]}
              </p>
            </div>

            {/* 文案区域 */}
            <div className="w-full" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
              <div className="neobrutal-card p-6 bg-[#E8F0FE] w-full">
                <p 
                  key={textIndex}
                  className="font-black text-center crazy-text-transition" 
                  style={{ fontSize: '20px' }}
                >
                  {crazyText}
                </p>
              </div>
              <p className="font-bold text-primary-color text-center" style={{ fontSize: '20px' }}>
                SBTI 1.0.0 扒光你所有伪装🥀
              </p>
              <p className="font-bold opacity-70 text-center" style={{ fontSize: '16px' }}>
                ©2026 别装了 你根本藏不住
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="neobrutal-container flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl mx-auto">
        <div className="neobrutal-card text-center mb-12">
          <h1 className="neobrutal-title mb-4">
            SBTI人格测试
          </h1>
          <p className="neobrutal-subtitle mb-2">
            探索你的赛博人格，解锁专属身份标签
          </p>
          <p className="text-lg font-bold">
            只需回答10个问题，开启你的数字人格之旅
          </p>
        </div>

        <div className="space-y-12">
          <div className="neobrutal-card cursor-pointer hover:translate-y-[-5px] transition-all duration-300 hover:shadow-[6px_6px_0px_#000]">
            <div className="flex items-center gap-4">
              <div className="text-4xl">⚡</div>
              <div>
                <h3 className="neobrutal-subtitle">快速测试</h3>
                <p>仅需5分钟，获得个性化人格分析</p>
              </div>
            </div>
          </div>

          <div className="neobrutal-card cursor-pointer hover:translate-y-[-5px] transition-all duration-300 hover:shadow-[6px_6px_0px_#000]">
            <div className="flex items-center gap-4">
              <div className="text-4xl">🎉</div>
              <div>
                <h3 className="neobrutal-subtitle">社交分享</h3>
                <p>生成专属海报，分享你的测试结果</p>
              </div>
            </div>
          </div>

          <div className="neobrutal-card cursor-pointer hover:translate-y-[-5px] transition-all duration-300 hover:shadow-[6px_6px_0px_#000]">
            <div className="flex items-center gap-4">
                 <div className="text-4xl">🐷</div>
              <div>
                <h3 className="neobrutal-subtitle">趣味解析</h3>
                <p>超准风格匹配，测测你是哪种赛博人</p>
              </div>
            </div>
          </div>
        </div>

        {/* 开始测试区块 - 水平居中，增加间距 */}
        <div 
          className="mt-16 flex justify-center"
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '88px'
          }}
        >
          <button 
            className="neobrutal-button neobrutal-button-primary text-xl"
            onClick={onStartTest}
          >
            开始测试
          </button>
        </div>

        {/* 底部文案 - 增加间距 */}
        <div 
          className="mt-6 text-center text-sm font-bold"
          style={{
            width: '100%',
            textAlign: 'center'
          }}
        >
          © 2026 广东阿伟的SBTI二创 | 仅供娱乐，请勿当真
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;

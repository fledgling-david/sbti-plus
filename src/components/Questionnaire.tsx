import React from 'react';
import { useTest } from '../context/TestContext';

interface QuestionnaireProps {
  onComplete: () => void;
}

const Questionnaire: React.FC<QuestionnaireProps> = ({ onComplete }) => {
  const { 
    questions, 
    currentQuestionIndex, 
    selectedOptions, 
    isLoading, 
    error,
    selectOption, 
    nextQuestion, 
    previousQuestion, 
    completeTest 
  } = useTest();

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const selectedOption = selectedOptions[currentQuestionIndex];

  const handleOptionClick = async (optionIndex: number) => {
    selectOption(optionIndex);
    if (isLastQuestion) {
      setTimeout(async () => {
        await completeTest();
        onComplete();
      }, 500);
    } else {
      setTimeout(() => {
        nextQuestion();
      }, 300);
    }
  };

  // 随机Emoji
  const emojis = ['🤔', '😎', '🤩', '🧐', '😜', '🤗', '🤫', '🤭'];
  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="neobrutal-card p-8">
          <div className="text-center">
            <h2 className="neobrutal-title">加载中...</h2>
            <div className="neobrutal-loading-spinner mb-4"></div>
            <p>正在准备题目...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="neobrutal-card p-8">
          <div className="text-center">
            <h2 className="neobrutal-title">出错了</h2>
            <p className="mb-4">{error}</p>
            <button className="neobrutal-button" onClick={() => window.location.reload()}>
              重试
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="neobrutal-container">
      {/* 问题和选项 */}
      <div className="question-section" style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
        <div className="neobrutal-card neobrutal-animate-slide">
          {/* 移动端进度条 - 与题目同一行 */}
          <div className="mobile-progress-row mb-6">
            <div className="emoji-3d" style={{ fontSize: '60px', marginBottom: '0' }}>{randomEmoji}</div>
            <div style={{ flex: '1', marginLeft: '16px' }}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="neobrutal-subtitle" style={{ fontSize: '16px', marginBottom: '0' }}>进度</h3>
                <div className="progress-text" style={{ fontSize: '12px', margin: '0' }}>
                  第 {currentQuestionIndex + 1} / {questions.length} 题
                </div>
              </div>
              <div className="neobrutal-progress" style={{ height: '32px' }}>
                <div 
                  className="neobrutal-progress-bar" 
                  style={{ width: `${progress}%` }}
                >
                  {Math.round(progress)}%
                </div>
              </div>
            </div>
          </div>

          {/* 题目 */}
          <div className="mb-8">
            <h2 className="neobrutal-title">
              {currentQuestion.text}
            </h2>
            
            {/* 选项 */}
            <div className="options-grid">
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className={`neobrutal-option ${selectedOption === index ? 'selected' : ''}`}
                  onClick={() => handleOptionClick(index)}
                >
                  <span className="option-letter">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option.text}
                </div>
              ))}
            </div>
          </div>

          {/* 导航按钮 - PC端 */}
          <div className="neobrutal-nav hidden md:flex">
            <button
              className="neobrutal-button"
              onClick={previousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              上一题
            </button>
            {!isLastQuestion && (
              <button
                className="neobrutal-button"
                onClick={nextQuestion}
                disabled={selectedOption === -1}
              >
                下一题
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 导航按钮 - 移动端 */}
      <div className="mobile-bottom-buttons md:hidden">
        <button
          className="neobrutal-button"
          onClick={previousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          上一题
        </button>
        {!isLastQuestion && (
          <button
            className="neobrutal-button"
            onClick={nextQuestion}
            disabled={selectedOption === -1}
          >
            下一题
          </button>
        )}
      </div>
    </div>
  );
};

export default Questionnaire;
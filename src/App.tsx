import { useState } from 'react';
import { TestProvider } from './context/TestContext';
import WelcomePage from './components/WelcomePage';
import Questionnaire from './components/Questionnaire';
import ResultPage from './components/ResultPage';
import StatisticsPage from './components/StatisticsPage';

function App() {
  const [currentPage, setCurrentPage] = useState<'welcome' | 'questionnaire' | 'result' | 'statistics'>('welcome');

  const handleStartTest = () => {
    setCurrentPage('questionnaire');
  };

  const handleCompleteTest = () => {
    setCurrentPage('result');
  };

  const handleRestartTest = () => {
    setCurrentPage('welcome');
  };

  const handleViewStatistics = () => {
    setCurrentPage('statistics');
  };

  const handleBackFromStatistics = () => {
    setCurrentPage('welcome');
  };

  return (
    <TestProvider>
      <div className="min-h-screen bg-black">
        {currentPage === 'welcome' && (
          <WelcomePage onStartTest={handleStartTest} onViewStatistics={handleViewStatistics} />
        )}
        {currentPage === 'questionnaire' && (
          <Questionnaire onComplete={handleCompleteTest} />
        )}
        {currentPage === 'result' && (
          <ResultPage onRestart={handleRestartTest} />
        )}
        {currentPage === 'statistics' && (
          <StatisticsPage onBack={handleBackFromStatistics} />
        )}
      </div>
    </TestProvider>
  );
}

export default App;

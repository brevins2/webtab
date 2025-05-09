import { useState, useEffect } from 'react';
import './App.css';
import Quiz from './Quiz';

function App() {
  const [doExam, setDoExam] = useState(false);
  const [savedData, setSavedData] = useState(null);

  const goFullScreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }

    setDoExam(true);
  };

  useEffect(() => {
    const existingData = localStorage.getItem('quiz_data');
    if (existingData) {
      setSavedData(JSON.parse(existingData));
    }
  }, []);

  useEffect(() => {
    const handleFullScreenChange = () => {
      const isFullscreen = document.fullscreenElement != null;

      if (!isFullscreen && doExam) {
        setDoExam(false);
        const currentAnswers = JSON.parse(localStorage.getItem('current_answers') || '{}');
        localStorage.setItem(
          'quiz_data',
          JSON.stringify({ submitted: true, userAnswers: currentAnswers })
        );
        localStorage.removeItem('current_answers');
      }
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, [doExam]);

  return (
    <div className="App">
      <button onClick={goFullScreen} className="fullscreen-btn" disabled={doExam || savedData?.submitted}>
        Start your exam
      </button>
      {(doExam || savedData) && <Quiz savedData={savedData} />}
    </div>
  );
}

export default App;

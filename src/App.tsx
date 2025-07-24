import React from 'react';
import { useState } from 'react';
import Hero from './components/Hero';
import Chatbot from './components/Chatbot';

function App() {
  const [currentView, setCurrentView] = useState<'hero' | 'chatbot'>('hero');

  const handleStartExploring = () => {
    setCurrentView('chatbot');
  };

  const handleBackToHome = () => {
    setCurrentView('hero');
  };

  return (
    <div className="min-h-screen">
      {currentView === 'hero' ? (
        <Hero onStartExploring={handleStartExploring} />
      ) : (
        <Chatbot onBackToHome={handleBackToHome} />
      )}
    </div>
  );
}

export default App;
import React from 'react';
import { useState } from 'react';
import Hero from './components/Hero';
import ProblemSection from './components/ProblemSection';
import HowItWorksSection from './components/HowItWorksSection';
import FeaturesSection from './components/FeaturesSection';
import UseCasesSection from './components/UseCasesSection';
import Chatbot from './components/Chatbot';
import Footer from './components/Footer';

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
        <>
          <Hero onStartExploring={handleStartExploring} />
          <ProblemSection />
          <HowItWorksSection />
          <FeaturesSection />
          <UseCasesSection />
        </>
      ) : (
        <Chatbot onBackToHome={handleBackToHome} />
      )}
      <Footer />
    </div>
  );
}

export default App;
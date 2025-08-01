import React from 'react';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProblemSection from './components/ProblemSection';
import HowItWorksSection from './components/HowItWorksSection';
import FeaturesSection from './components/FeaturesSection';
import UseCasesSection from './components/UseCasesSection';
import Chatbot from './components/Chatbot';
import Footer from './components/Footer';

function App() {
  const [currentView, setCurrentView] = useState<'hero' | 'chatbot'>('hero');

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStartExploring = () => {
    setCurrentView('chatbot');
  };

  const handleBackToHome = () => {
    setCurrentView('hero');
  };

  return (
    <div className="min-h-screen">
      {currentView === 'hero' && (
        <Navbar onStartExploring={handleStartExploring} scrollToSection={scrollToSection} />
      )}
      {currentView === 'hero' ? (
        <>
          <Hero onStartExploring={handleStartExploring} scrollToSection={scrollToSection} />
          <ProblemSection />
          <HowItWorksSection />
          <FeaturesSection />
          <UseCasesSection />
        </>
      ) : (
        <Chatbot onBackToHome={handleBackToHome} />
      )}
      {currentView === 'hero' && <Footer />}
    </div>
  );
}

export default App;
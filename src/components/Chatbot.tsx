import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Download, Bot, User, Globe, Sparkles, Play } from 'lucide-react';
import ContextInputModal from './ContextInputModal';

interface ChatMessage {
  id: number;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface ChatbotProps {
  onBackToHome: () => void;
}

type OnboardingSubPhase = 'initial_question' | 'explaining_app';
type AppPhase = 'onboarding' | 'strategic';

const Chatbot: React.FC<ChatbotProps> = ({ onBackToHome }) => {
  // Function to clean bot responses
  const cleanBotResponse = (text: string): string => {
    // Remove ** symbols (bold markdown)
    let cleaned = text.replace(/\*\*/g, '');
    
    // Remove emojis using Unicode ranges
    cleaned = cleaned.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '');
    
    // Remove other common emoji ranges
    cleaned = cleaned.replace(/[\u{1F900}-\u{1F9FF}]|[\u{1FA70}-\u{1FAFF}]/gu, '');
    
    // Remove bullet points with emojis (like 🔍, 🚀, etc.)
    cleaned = cleaned.replace(/[🔍🚀🎯🔧💼🏢🌍]/gu, '');
    
    // Clean up extra whitespace
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    
    return cleaned;
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      type: 'bot',
      content: cleanBotResponse("Hello! I am your Cultural AI Assistant, powered by the Qloo API and advanced AI models.\n\n I can help you understand cultural preferences, local trends, and market opportunities around the world to successfully grow your business.\n\n Feel free to ask me questions about:\n - How this application works\n - What are the possible use cases?\n- How can cultural AI help you?\n- What features are available?\n\nOnce you understand the tool's potential, you can click the start button to begin your personalized analysis!"),
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentAppPhase, setCurrentAppPhase] = useState<AppPhase>('onboarding');
  const [onboardingSubPhase, setOnboardingSubPhase] = useState<OnboardingSubPhase>('initial_question');
  const [showContextModal, setShowContextModal] = useState(false);
  const [targetLocation, setTargetLocation] = useState<string | null>(null);
  const [userBusinessType, setUserBusinessType] = useState<string | null>(null);
  const [qlooInsights, setQlooInsights] = useState<any | null>(null);

  const handleContextSubmit = async (location: string, businessType: string) => {
    setIsLoading(true);
    
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Configuration Supabase manquante. Veuillez configurer vos variables d\'environnement Supabase.');
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/chat-orchestrator`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phase: 'fetch_qloo_insights',
          targetLocation: location,
          userBusinessType: businessType,
          message: ''
        })
      });

      if (!response.ok) {
        let errorMessage = `Échec de la requête API : ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (parseError) {
          console.error('Échec de l\'analyse de la réponse d\'erreur:', parseError);
        }
        throw new Error(errorMessage);
      }

      const insights = await response.json();
      
      // Store the insights and update state
      setQlooInsights(insights);
      setTargetLocation(location);
      setUserBusinessType(businessType);
      setCurrentAppPhase('strategic');
      setShowContextModal(false);
      
      // Add a transition message from the bot
      const transitionMessage: ChatMessage = {
        id: messages.length + 1,
        type: 'bot',
        content: cleanBotResponse(`Parfait ! J'ai récupéré les insights culturels pour ${location} dans le secteur ${businessType}. Je peux maintenant vous fournir des conseils stratégiques personnalisés basés sur les données culturelles spécifiques à votre marché cible.\n\nVous pouvez me poser des questions comme :\n- Quels produits adapter pour ce marché ?\n- Quelle stratégie d'implantation adopter ?\n- Y a-t-il des préférences culturelles spécifiques à prendre en compte ?\n- Comment adapter ma communication marketing ?\n\nQue souhaitez-vous savoir ?`),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, transitionMessage]);
      
    } catch (error) {
      console.error('Erreur lors de la récupération des insights Qloo:', error);
      
      const errorMessage: ChatMessage = {
        id: messages.length + 1,
        type: 'bot',
        content: cleanBotResponse(`Je m'excuse, mais j'ai rencontré un problème lors de la récupération des données culturelles. Cela pourrait être dû à des problèmes de connectivité réseau ou de maintenance du serveur.\n\nVeuillez réessayer dans un moment. Si le problème persiste, vous pouvez toujours me poser des questions générales sur l'intelligence culturelle !`),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Configuration Supabase manquante. Veuillez configurer vos variables d\'environnement Supabase.');
      }

      // Prepare request body based on current app phase
      let requestBody: any = {
        message: currentInput
      };

      if (currentAppPhase === 'onboarding') {
        requestBody.phase = 'onboarding_sub_phase';
        requestBody.onboardingSubPhase = onboardingSubPhase;
      } else if (currentAppPhase === 'strategic') {
        requestBody.phase = 'strategic';
        requestBody.targetLocation = targetLocation;
        requestBody.userBusinessType = userBusinessType;
        requestBody.qlooInsights = qlooInsights;
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/chat-orchestrator`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        let errorMessage = `Échec de la requête API : ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (parseError) {
          console.error('Échec de l\'analyse de la réponse d\'erreur:', parseError);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      if (data.error || data.errorType) {
        const errorMessage = data.message || 'Une erreur inattendue s\'est produite. Veuillez réessayer.';
        
        const errorBotMessage: ChatMessage = {
          id: messages.length + 2,
          type: 'bot',
          content: cleanBotResponse(errorMessage),
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, errorBotMessage]);
        return;
      }
      
      // Update onboarding sub-phase if we're still in onboarding
      if (currentAppPhase === 'onboarding' && data.nextPhase) {
        setOnboardingSubPhase(data.nextPhase as OnboardingSubPhase);
      }
      
      const cleanedResponse = cleanBotResponse(data.response || 'Désolé, je n\'ai pas pu traiter votre demande pour le moment.');
      
      const botMessage: ChatMessage = {
        id: messages.length + 2,
        type: 'bot',
        content: cleanedResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      
    } catch (error) {
      console.error('Erreur lors de l\'appel du chat orchestrator:', error);
      
      const errorMessage: ChatMessage = {
        id: messages.length + 2,
        type: 'bot',
        content: cleanBotResponse(`Je m'excuse, mais j'ai des difficultés à me connecter à mes services en ce moment. Cela pourrait être dû à des problèmes de connectivité réseau ou de maintenance du serveur.\n\nVeuillez réessayer dans un moment. Si le problème persiste, vous pouvez toujours me poser des questions générales sur la recherche de marché culturel et je ferai de mon mieux pour vous aider !`),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const exportToPDF = () => {
    // Placeholder for PDF export functionality
    console.log('Export de la conversation en PDF...');
    alert('La fonctionnalité d\'export PDF sera bientôt implémentée !');
  };

  return (
    <div className="min-h-screen bg-[#F7F7F8]">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm border-b border-[#E5E7EB] sticky top-0 z-50"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBackToHome}
                className="flex items-center gap-2 px-3 py-1.5 text-[#1877F2] hover:bg-[#F9FAFB] rounded-md transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Home</span>
              </button>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-[#2563EB] to-[#1877F2] rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-[#111827]">Cultural AI</h1>
                  <p className="text-xs text-[#6B7280]">
                    {currentAppPhase === 'onboarding' ? 'Mode découverte' : `Analyse: ${targetLocation} - ${userBusinessType}`}
                  </p>
                </div>
              </div>
            </div>
            
            <button
              onClick={exportToPDF}
              className="group relative flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#2563EB] to-[#1877F2] text-white rounded-xl hover:scale-105 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#1877F2]/30 transition-all duration-300 text-sm font-medium shadow-md shadow-blue-500/20 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#1877F2] via-[#60A5FA] to-[#2563EB] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
              <div className="relative flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span className="font-medium">Export PDF</span>
              </div>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white rounded-lg shadow-lg border border-[#E5E7EB] overflow-hidden">
          
          {/* Messages Area */}
          <div className="h-[calc(100vh-200px)] min-h-[500px] max-h-[700px] overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} px-2`}
              >
                <div className={`flex gap-3 max-w-[75%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user' 
                      ? 'bg-[#1877F2]' 
                      : 'bg-gradient-to-r from-[#2563EB] to-[#1877F2]'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-white" />
                    )}
                  </div>
                  
                  <div className={`rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-[#1877F2] text-white'
                      : 'bg-[#F7F7F8] text-[#111827]'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                    <p className={`text-xs mt-1.5 ${
                      message.type === 'user' ? 'text-blue-100' : 'text-[#6B7280]'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Loading Indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex gap-3 px-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#2563EB] to-[#1877F2] rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-[#F7F7F8] rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        <motion.div
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                          className="w-2 h-2 bg-[#1877F2] rounded-full"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                          className="w-2 h-2 bg-[#1877F2] rounded-full"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                          className="w-2 h-2 bg-[#1877F2] rounded-full"
                        />
                      </div>
                      <span className="text-[#6B7280] text-sm">Analyzing cultural data...</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
          
          {/* Input Area */}
          <div className="border-t border-[#E5E7EB] p-4 bg-white shadow-md">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gray-100 rounded-3xl shadow-sm flex items-center gap-2 p-2">
                {currentAppPhase === 'onboarding' && (
                  <button 
                    onClick={() => setShowContextModal(true)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white bg-gradient-to-r from-[#2563EB] to-[#1877F2] hover:shadow-lg hover:shadow-[#1877F2]/30 flex-shrink-0 transition-all duration-200 hover:scale-105"
                    title="Commencer l'analyse culturelle"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                )}
                
                <div className="flex-1">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={
                      currentAppPhase === 'onboarding' 
                        ? "Posez vos questions sur l'application, ses fonctionnalités, ses cas d'usage..."
                        : "Posez vos questions sur les stratégies culturelles, les préférences locales..."
                    }
                    className="w-full bg-transparent text-gray-800 placeholder-gray-500 resize-none outline-none py-2 px-0 min-h-[24px] max-h-[120px] overflow-y-auto"
                    rows={1}
                    disabled={isLoading}
                  />
                </div>
                
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="w-9 h-9 p-0 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 flex items-center justify-center"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Context Input Modal */}
        <ContextInputModal
          isOpen={showContextModal}
          onClose={() => setShowContextModal(false)}
          onSubmit={handleContextSubmit}
        />
      </div>
    </div>
  );
};

export default Chatbot;
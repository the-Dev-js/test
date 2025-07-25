import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Download, Bot, User, Globe, Sparkles } from 'lucide-react';

interface ChatMessage {
  id: number;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface ChatbotProps {
  onBackToHome: () => void;
}

type OnboardingPhase = 'initial_question' | 'explaining_app' | 'awaiting_business_type' | 'awaiting_location' | 'ready_for_query';

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
      content: cleanBotResponse("Hello! 👋 I'm your Cultural AI Assistant, powered by Qloo API and advanced AI models.\n\nI can help you understand cultural preferences, local trends, and market opportunities anywhere in the world to expand your business successfully.\n\n**Would you like to:**\n\n🔍 **Learn more** about how I work and what I can do for your business?\n\n🚀 **Jump right in** and ask me a question about a specific market?\n\nJust let me know your preference!"),
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [onboardingPhase, setOnboardingPhase] = useState<OnboardingPhase>('initial_question');
  const [userBusinessType, setUserBusinessType] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<string | null>(null);

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

    // Handle different onboarding phases
    if (onboardingPhase === 'initial_question') {
      // User is choosing between learning more or jumping in
      if (currentInput.includes('learn') || currentInput.includes('more') || currentInput.includes('how') || currentInput.includes('what') || currentInput.includes('explain')) {
        setOnboardingPhase('explaining_app');
        const explanationMessage: ChatMessage = {
          id: messages.length + 2,
          type: 'bot',
          content: cleanBotResponse("Great! Let me explain how I can help your business succeed globally 🌍\n\n**🎯 What I Do:**\nI analyze cultural preferences, local trends, and consumer behaviors in any market worldwide. Think of me as your cultural intelligence consultant who helps you understand what makes each market unique.\n\n**🔧 How I Work:**\n• I use Qloo's cultural intelligence API to gather real-time data about local preferences\n• I combine this with advanced AI models (like Gemini) to provide actionable insights\n• I give you specific recommendations tailored to your business and target market\n\n**💼 Use Cases:**\n• **Retailers:** What products will resonate in Tokyo vs. Toronto?\n• **Restaurants:** What flavors and dining experiences do locals prefer?\n• **Services:** How do cultural values affect customer expectations?\n• **Marketing:** What messaging and channels work best locally?\n\n**🚀 Ready to explore a market?**\nTo give you the most relevant insights, I'll need to know:\n1. Your business type (e.g., fashion retail, restaurant, tech service)\n2. The location you're interested in (city, region, or country)\n3. Your specific question or challenge\n\nWhat market would you like to explore?"),
          timestamp: new Date()
        };
        setMessages(prev => [...prev, explanationMessage]);
        // After explanation, ask for business type
        setTimeout(() => {
          const businessTypeMessage: ChatMessage = {
            id: messages.length + 3,
            type: 'bot',
            content: "Perfect! Let's start by understanding your business better.\n\nWhat type of business do you have or are you planning to start? For example:\n• Restaurant or food service\n• Retail store (fashion, electronics, etc.)\n• Tech service or app\n• Consulting or professional service\n• Manufacturing\n• Or something else entirely\n\nJust describe your business in a few words! 🏢",
            timestamp: new Date()
          };
          setMessages(prev => [...prev, businessTypeMessage]);
          setOnboardingPhase('awaiting_business_type');
        }, 1000);
      } else if (currentInput.includes('jump') || currentInput.includes('ready') || currentInput.includes('ask') || currentInput.includes('question') || currentInput.includes('no')) {
        setOnboardingPhase('awaiting_business_type');
        const businessTypeMessage: ChatMessage = {
          id: messages.length + 2,
          type: 'bot',
          content: cleanBotResponse("Great! Let's dive right in 🚀\n\nFirst, tell me about your business. What type of business do you have or are you planning to start?\n\nFor example:\n• Restaurant or food service\n• Retail store (fashion, electronics, etc.)\n• Tech service or app\n• Consulting or professional service\n• Manufacturing\n• Or something else entirely\n\nJust describe your business in a few words! 🏢"),
          timestamp: new Date()
        };
        setMessages(prev => [...prev, businessTypeMessage]);
      } else {
        // User input is unclear
        const clarificationMessage: ChatMessage = {
          id: messages.length + 2,
          type: 'bot',
          content: cleanBotResponse("I'd love to help! Could you let me know if you'd like to:\n\n🔍 **Learn more** about how I work and what I can do\n🚀 **Ask a question** directly about a specific market\n\nJust type something like \"learn more\" or \"ask a question\" and I'll guide you accordingly!"),
          timestamp: new Date()
        };
        setMessages(prev => [...prev, clarificationMessage]);
      }
      setIsLoading(false);
    } else if (onboardingPhase === 'awaiting_business_type') {
      // Store the business type and ask for location
      setUserBusinessType(currentInput);
      const cleanedBusinessType = cleanBotResponse(`Perfect! So you have a ${currentInput.toLowerCase()} business. That's exciting!`);
      const locationMessage: ChatMessage = {
        id: messages.length + 2,
        type: 'bot',
        content: cleanBotResponse(`${cleanedBusinessType}\n\nNow, which location or market are you interested in exploring? This could be:\n\n• A specific city (e.g., \"Paris\", \"Tokyo\", \"New York\")\n• A country (e.g., \"France\", \"Japan\", \"Brazil\")\n• A region (e.g., \"Southeast Asia\", \"Northern Europe\")\n• Or even a neighborhood if you're thinking locally\n\nWhere would you like to expand or understand better?`),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, locationMessage]);
      setOnboardingPhase('awaiting_location');
      setIsLoading(false);
    } else if (onboardingPhase === 'awaiting_location') {
      // Store the location and confirm readiness
      setUserLocation(currentInput);
      const cleanedConfirmation = cleanBotResponse(`Excellent! I now understand that you have a ${userBusinessType?.toLowerCase()} business and you're interested in the ${currentInput} market.`);
      const readyMessage: ChatMessage = {
        id: messages.length + 2,
        type: 'bot',
       content: cleanBotResponse(`${cleanedConfirmation}\n\nI'm ready to provide you with detailed cultural insights, local preferences, and actionable recommendations for this market.\n\nWhat specific question do you have about ${currentInput}? For example:\n• What are the local preferences and trends?\n• How should I adapt my products/services?\n• What marketing approaches work best there?\n• What cultural factors should I consider?\n\nFeel free to ask anything about expanding your ${userBusinessType?.toLowerCase()} business in ${currentInput}!`),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, readyMessage]);
      setOnboardingPhase('ready_for_query');
      setIsLoading(false);
    } else if (onboardingPhase === 'ready_for_query') {
      // User is ready to make actual queries - call the Edge Function
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        
        if (!supabaseUrl || !supabaseAnonKey) {
          throw new Error('Supabase configuration missing. Please set up your Supabase environment variables.');
        }

        const response = await fetch(`${supabaseUrl}/functions/v1/chat-orchestrator`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: inputValue, // Use original input, not lowercased
            businessType: userBusinessType || 'general business',
            location: userLocation || 'global market',
            context: 'general_inquiry'
          })
        });

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        
        // Clean the bot response to remove emojis and *** symbols
        const cleanedResponse = cleanBotResponse(data.response || 'Sorry, I could not process your request at this time.');
        
        const botMessage: ChatMessage = {
          id: messages.length + 2,
          type: 'bot',
          content: cleanedResponse,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, botMessage]);
      } catch (error) {
        console.error('Error calling chat orchestrator:', error);
        
        const errorMessage: ChatMessage = {
          id: messages.length + 2,
          type: 'bot',
         content: cleanBotResponse(`I apologize, but I'm having trouble connecting to my cultural intelligence services right now. This could be due to:\n\n• Supabase configuration not set up yet\n• API keys not configured\n• Network connectivity issues\n\nPlease check your Supabase setup and try again. In the meantime, I'd be happy to help you think through your cultural market research questions!`),
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
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
    console.log('Exporting conversation to PDF...');
    alert('PDF export functionality will be implemented soon!');
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
                  <p className="text-xs text-[#6B7280]">Powered by Qloo & Gemini</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={exportToPDF}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#1877F2] text-white rounded-md hover:bg-[#2563EB] transition-colors duration-200 text-sm"
            >
              <Download className="w-4 h-4" />
              <span className="font-medium">Export PDF</span>
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
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about cultural preferences, local tastes, or business opportunities..."
                  className="w-full p-3 pr-12 border border-[#E5E7EB] rounded-lg max-h-40 focus:outline-none focus:ring-2 focus:ring-[#1877F2] focus:border-transparent text-[#111827] placeholder-[#6B7280] resize-y"
                  rows={3}
                  disabled={isLoading}
                />
                <div className="absolute bottom-2 right-2 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#9CA3AF]" />
                </div>
              </div>
              
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="px-4 py-2 bg-gradient-to-r from-[#2563EB] to-[#1877F2] text-white rounded-lg hover:shadow-lg hover:shadow-[#1877F2]/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium self-end"
              >
                <Send className="w-4 h-4" />
                <span>Send</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
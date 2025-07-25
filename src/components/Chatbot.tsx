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

const Chatbot: React.FC<ChatbotProps> = ({ onBackToHome }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      type: 'bot',
      content: "Hello! I'm your Cultural AI Assistant powered by Qloo and Gemini. I'm here to help you understand local cultural preferences and discover new business opportunities. \n\nTo get started, please tell me:\n• Your business type (e.g., furniture store, fashion retailer, restaurant)\n• The location you want to explore (city, neighborhood, or region)\n\nLet's unlock the cultural insights of your target market! 🌍",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      // Call Supabase Edge Function
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
          message: currentInput,
          businessType: 'retail', // You can make this dynamic later
          location: 'Canada', // You can make this dynamic later
          context: 'general_inquiry'
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      const botMessage: ChatMessage = {
        id: messages.length + 2,
        type: 'bot',
        content: data.response || 'Sorry, I could not process your request at this time.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error calling chat orchestrator:', error);
      
      const errorMessage: ChatMessage = {
        id: messages.length + 2,
        type: 'bot',
        content: `I apologize, but I'm having trouble connecting to my cultural intelligence services right now. This could be due to:\n\n• Supabase configuration not set up yet\n• API keys not configured\n• Network connectivity issues\n\nPlease check your Supabase setup and try again. In the meantime, I'd be happy to help you think through your cultural market research questions!`,
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
    console.log('Exporting conversation to PDF...');
    alert('PDF export functionality will be implemented soon!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-[#F9FAFB] to-[#F9FAFB]">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-sm border-b border-[#E5E7EB] sticky top-0 z-50"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBackToHome}
                className="flex items-center gap-2 px-3 py-2 text-[#1877F2] hover:bg-[#F9FAFB] rounded-lg transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Home</span>
              </button>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-[#2563EB] to-[#1877F2] rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-[#111827]">TasteMatch Cultural AI</h1>
                  <p className="text-sm text-[#1877F2]">Powered by Qloo & Gemini</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={exportToPDF}
              className="flex items-center gap-2 px-4 py-2 bg-[#1877F2] text-white rounded-lg hover:bg-[#2563EB] transition-colors duration-200"
            >
              <Download className="w-4 h-4" />
              <span className="font-medium">Export PDF</span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl border border-[#E5E7EB] overflow-hidden">
          
          {/* Messages Area */}
          <div className="h-[600px] overflow-y-auto p-6 space-y-6">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
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
                  
                  <div className={`rounded-2xl p-4 ${
                    message.type === 'user'
                      ? 'bg-[#1877F2] text-white'
                      : 'bg-[#F9FAFB] text-[#111827] border border-[#E5E7EB]'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                    <p className={`text-xs mt-2 ${
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
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#2563EB] to-[#1877F2] rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-4">
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                          className="w-2 h-2 bg-[#1877F2] rounded-full"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                          className="w-2 h-2 bg-[#1877F2] rounded-full"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
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
          <div className="border-t border-[#E5E7EB] p-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about cultural preferences, local tastes, or business opportunities..."
                  className="w-full p-4 pr-12 border border-[#E5E7EB] rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#1877F2] focus:border-transparent text-[#111827] placeholder-[#6B7280]"
                  rows={3}
                  disabled={isLoading}
                />
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#6B7280]" />
                </div>
              </div>
              
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="px-6 py-3 bg-gradient-to-r from-[#2563EB] to-[#1877F2] text-white rounded-xl hover:shadow-lg hover:shadow-[#1877F2]/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
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
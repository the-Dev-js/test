import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User } from 'lucide-react';

interface ChatMessage {
  id: number;
  type: 'user' | 'bot';
  text: string;
  delay: number;
}

const messages: ChatMessage[] = [
  {
    id: 1,
    type: 'user',
    text: "What are the favorite hobbies of Canadians?",
    delay: 1000
  },
  {
    id: 2,
    type: 'bot',
    text: "Top hobbies include hockey, hiking, watching Netflix, and attending local festivals.",
    delay: 3000
  },
  {
    id: 3,
    type: 'user',
    text: "Great. What food should I feature in my local store?",
    delay: 6000
  },
  {
    id: 4,
    type: 'bot',
    text: "Consider maple syrup products, poutine ingredients, Tim Hortons-style items, and local craft beer partnerships.",
    delay: 8500
  }
];

const AnimatedPhone = () => {
  const [visibleMessages, setVisibleMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const showMessages = () => {
      messages.forEach((message, index) => {
        setTimeout(() => {
          if (message.type === 'bot') {
            setIsTyping(true);
            setTimeout(() => {
              setIsTyping(false);
              setVisibleMessages(prev => [...prev, message]);
            }, 1500);
          } else {
            setVisibleMessages(prev => [...prev, message]);
          }
        }, message.delay);
      });
    };

    showMessages();

    // Reset animation every 15 seconds
    const interval = setInterval(() => {
      setVisibleMessages([]);
      setIsTyping(false);
      setTimeout(showMessages, 1000);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="relative"
      animate={{ 
        y: [0, -8, 0]
      }}
      transition={{ 
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {/* Phone Frame */}
      <div className="relative w-72 h-[580px] bg-gradient-to-br from-[#111827] to-[#374151] rounded-[2.5rem] p-1 shadow-2xl shadow-[#111827]/30">
        <div className="w-full h-full bg-white rounded-[2.2rem] overflow-hidden relative border border-[#E5E7EB]">
          
          {/* Notch */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-[#111827] rounded-b-2xl z-10"></div>
          
          {/* Status Bar */}
          <div className="flex justify-between items-center px-6 py-3 pt-8 text-[#111827] text-sm font-medium">
            <span>9:41</span>
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-[#1877F2] rounded-full"></div>
              <div className="w-1 h-1 bg-[#1877F2] rounded-full"></div>
              <div className="w-1 h-1 bg-[#1877F2] rounded-full"></div>
              <div className="w-4 h-2 bg-[#FBBF24] rounded-sm ml-1"></div>
            </div>
          </div>
          
          {/* Chat Header */}
          <div className="flex items-center gap-3 px-6 py-3 bg-[#F9FAFB] border-b border-[#E5E7EB]">
            <div className="w-8 h-8 bg-gradient-to-r from-[#2563EB] to-[#1877F2] rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-[#111827] font-semibold text-sm">Cultural AI Assistant</h3>
              <p className="text-[#1877F2] text-xs">Online • Powered by GPT & Qloo</p>
            </div>
          </div>
          
          {/* Chat Messages */}
          <div className="flex-1 p-4 space-y-3 overflow-hidden bg-white">
            <AnimatePresence>
              {visibleMessages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] rounded-2xl p-3 ${
                    message.type === 'user' 
                      ? 'bg-gradient-to-r from-[#2563EB] to-[#1877F2] text-white' 
                      : 'bg-[#F9FAFB] text-[#111827] border border-[#E5E7EB]'
                  }`}>
                    <p className="text-xs leading-relaxed">{message.text}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-3 flex items-center gap-2">
                  <div className="flex space-x-1">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      className="w-1.5 h-1.5 bg-[#60A5FA] rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      className="w-1.5 h-1.5 bg-[#60A5FA] rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                      className="w-1.5 h-1.5 bg-[#60A5FA] rounded-full"
                    />
                  </div>
                  <span className="text-[#6B7280] text-xs">AI is typing...</span>
                </div>
              </motion.div>
            )}
          </div>
          
          {/* Chat Input */}
          <div className="p-4 bg-white border-t border-[#E5E7EB]">
            <div className="flex items-center gap-3 bg-[#F9FAFB] rounded-full px-4 py-2 border border-[#E5E7EB]">
              <input 
                type="text" 
                placeholder="Ask about any culture..."
                className="flex-1 bg-transparent text-[#111827] placeholder-[#6B7280] outline-none text-xs"
                readOnly
              />
              <div className="w-6 h-6 bg-gradient-to-r from-[#2563EB] to-[#1877F2] rounded-full flex items-center justify-center">
                <User className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Phone Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/15 via-[#1877F2]/10 to-[#60A5FA]/15 rounded-[2.5rem] blur-xl -z-10"></div>
    </motion.div>
  );
};

export default AnimatedPhone;
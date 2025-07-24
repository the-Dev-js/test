import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Languages, Sun } from 'lucide-react';
import AnimatedPhone from './AnimatedPhone';
import ParticleBackground from './ParticleBackground';

interface HeroProps {
  onStartExploring: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStartExploring }) => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-[#F9FAFB] via-[#F9FAFB] to-[#F9FAFB] overflow-hidden">
      <ParticleBackground />
      
      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[85vh]">
          
          {/* Left Side - Text Zone */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="space-y-8">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-3"
              >
                {/* Language Selection Button */}
                <button className="group flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full border border-[#60A5FA]/20 shadow-sm text-[#1877F2] hover:bg-white hover:border-[#1877F2]/40 hover:shadow-md transition-all duration-300 hover:scale-105">
                  <Languages className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="text-sm font-medium">EN</span>
                  <div className="w-1 h-1 bg-[#FBBF24] rounded-full opacity-60"></div>
                </button>
                
                {/* Theme Toggle Button */}
                <button className="group flex items-center justify-center p-2 bg-white/90 backdrop-blur-sm rounded-full border border-[#60A5FA]/20 shadow-sm text-[#1877F2] hover:bg-white hover:border-[#1877F2]/40 hover:shadow-md transition-all duration-300 hover:scale-105">
                  <Sun className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                </button>
                
                {/* AI Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-black rounded-full border border-[#60A5FA]/20 shadow-sm">
                  <div className="w-2 h-2 bg-[#FBBF24] rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-white">AI-Powered Cultural Intelligence</span>
                </div>
              </motion.div>
              
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#111827] leading-[1.05] tracking-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="text-[#111827]">
                  Conquer New Markets
                </span>
                <br />
                <span className="bg-gradient-to-r from-[#2563EB] via-[#1877F2] to-[#60A5FA] bg-clip-text text-transparent">
                  With Cultural Intelligence
                </span>
              </motion.h1>
              
              <motion.p
                className="text-lg text-[#1877F2] font-semibold"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Powered by Qloo-API, Gemini & powerfull LLM
              </motion.p>
              
              <motion.p
                className="text-base text-[#4B5563] max-w-lg leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Transform your global expansion with AI-powered cultural insights. Understand local tastes, habits, and preferences to make your brand truly resonate worldwide.
              </motion.p>
            </div>
            
            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <button 
                onClick={onStartExploring}
                className="group relative px-6 py-3 bg-gradient-to-r from-[#2563EB] via-[#1877F2] to-[#60A5FA] text-white font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-[#1877F2]/30 hover:scale-[1.02] shadow-md shadow-blue-500/20 hover:-translate-y-0.5"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#1877F2] via-[#60A5FA] to-[#2563EB] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                <div className="relative flex items-center justify-center gap-2">
                  <span>Start Exploring Cultures</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </button>
              
              <button className="group px-6 py-3 bg-white/90 backdrop-blur-sm text-[#1877F2] font-semibold rounded-xl border border-[#60A5FA]/20 hover:bg-white hover:border-[#1877F2]/40 transition-all duration-300 hover:shadow-lg hover:shadow-[#60A5FA]/20 hover:scale-[1.02] shadow-md hover:-translate-y-0.5">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                <div className="flex items-center justify-center gap-2">
                  <div className="relative">
                  <Play className="w-5 h-5" />
                    <div className="absolute inset-0 bg-[#1877F2]/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-300 opacity-0 group-hover:opacity-100"></div>
                  </div>
                  <span>How It Works</span>
                </div>
              </button>
            </motion.div>
          </motion.div>
          
          {/* Right Side - Visual Zone */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative flex justify-center items-center"
          >
            <AnimatedPhone />
          </motion.div>
        </div>
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#F9FAFB]/20 via-transparent to-[#F9FAFB]/10 pointer-events-none"></div>
    </section>
  );
};

export default Hero;
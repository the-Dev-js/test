import React from 'react';
import { Heart, Globe, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-6">
          
          {/* Left side - Brand */}
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="w-8 h-8 bg-gradient-to-r from-[#2563EB] to-[#1877F2] rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#111827]">Cultural AI</h3>
              <p className="text-xs text-[#6B7280]">Powered by Qloo & AI</p>
            </div>
          </div>
          
          {/* Center - Copyright */}
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 text-sm text-[#6B7280] text-center md:text-left">
            <span>© 2025 Cultural AI. Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>for global expansion</span>
          </div>
          
          {/* Right side - Links */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-4 md:gap-6 text-sm">
            <a 
              href="#" 
              className="text-[#6B7280] hover:text-[#1877F2] transition-colors duration-200 flex items-center gap-1"
            >
              <Globe className="w-4 h-4" />
              <span>Global Markets</span>
            </a>
            <a 
              href="#" 
              className="text-[#6B7280] hover:text-[#1877F2] transition-colors duration-200"
            >
              Secure
            </a>
            <a 
              href="#" 
              className="text-[#6B7280] hover:text-[#1877F2] transition-colors duration-200"
            >
              Free/powerful
            </a>
          </div>
        </div>
        
        {/* Bottom line */}
        <div className="mt-8 pt-6 border-t border-gray-50">
          <p className="text-center text-xs text-[#9CA3AF]">
            Empowering businesses to understand and connect with cultures worldwide through AI-powered insights.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
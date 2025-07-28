import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Menu } from 'lucide-react';

interface NavbarProps {
  onStartExploring: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onStartExploring }) => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-4 left-0 right-0 mx-auto z-50 w-full max-w-5xl"
    >
      <div className="bg-white/10 backdrop-blur-md rounded-full shadow-lg border border-white/20 px-6 py-3 mx-4">
        <div className="flex items-center justify-between">
          
          {/* Logo Section */}
          <button
            onClick={() => scrollToSection('home')}
            className="flex items-center gap-3 hover:scale-105 transition-transform duration-200"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-[#2563EB] to-[#1877F2] rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-[#111827]">Cultural AI</span>
          </button>
          
          {/* Navigation Links - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('home')}
              className="text-[#6B7280] hover:text-[#1877F2] transition-colors duration-200 font-medium"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-[#6B7280] hover:text-[#1877F2] transition-colors duration-200 font-medium"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-[#6B7280] hover:text-[#1877F2] transition-colors duration-200 font-medium"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('use-cases')}
              className="text-[#6B7280] hover:text-[#1877F2] transition-colors duration-200 font-medium"
            >
              Use Cases
            </button>
          </div>
          
          {/* CTA Button - Hidden on mobile, Menu icon on mobile */}
          <div className="flex items-center gap-4">
            <button
              onClick={onStartExploring}
              className="hidden md:flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#2563EB] to-[#1877F2] text-white font-semibold rounded-full hover:shadow-lg hover:shadow-[#1877F2]/30 transition-all duration-300 hover:scale-105"
            >
              <span>Start Exploring</span>
            </button>
            
            {/* Mobile Menu Icon */}
            <button className="md:hidden p-2 text-[#6B7280] hover:text-[#1877F2] transition-colors duration-200">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
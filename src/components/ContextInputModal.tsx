import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Building, Play } from 'lucide-react';

interface ContextInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (location: string, businessType: string) => void;
}

const ContextInputModal: React.FC<ContextInputModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [location, setLocation] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!location.trim() || !businessType.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(location.trim(), businessType.trim());
      // Reset form
      setLocation('');
      setBusinessType('');
    } catch (error) {
      console.error('Error submitting context:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setLocation('');
      setBusinessType('');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 border border-gray-100"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200 disabled:opacity-50"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-[#2563EB] to-[#1877F2] rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Start cultural analysis
              </h2>
              <p className="text-gray-600 text-sm">
                Provide this information to get personalized insights.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Location Input */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  current location or target location
                </label>
                <input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ex: France, Tokyo, New York..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1877F2] focus:border-transparent outline-none transition-all duration-200"
                  disabled={isSubmitting}
                  required
                />
              </div>

              {/* Business Type Input */}
              <div>
                <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-2">
                  <Building className="w-4 h-4 inline mr-2" />
                  Business type
                </label>
                <input
                  id="businessType"
                  type="text"
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  placeholder="Ex: Restaurant, E-commerce, Startup tech..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1877F2] focus:border-transparent outline-none transition-all duration-200"
                  disabled={isSubmitting}
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!location.trim() || !businessType.trim() || isSubmitting}
                className="w-full py-3 px-4 bg-gradient-to-r from-[#2563EB] to-[#1877F2] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#1877F2]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Analyse en cours...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Lancer l'analyse</span>
                  </>
                )}
              </button>
            </form>

            {/* Info */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700 text-center">
                Ces informations nous permettront de récupérer des insights culturels spécifiques à votre marché cible
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ContextInputModal;
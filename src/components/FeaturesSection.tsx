import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Globe, 
  Target, 
  BarChart3, 
  MessageCircle, 
  Shield, 
  Clock, 
  Sparkles 
} from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Zap,
      title: "Real-Time Cultural Insights",
      description: "Access up-to-date cultural preferences and trends from Qloo's continuously updated database.",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: Globe,
      title: "Global Market Coverage",
      description: "Get insights for any country, city, or region worldwide with comprehensive cultural data.",
      color: "from-blue-400 to-cyan-500"
    },
    {
      icon: Target,
      title: "Personalized Recommendations",
      description: "Receive tailored strategies based on your specific business type and target market.",
      color: "from-green-400 to-emerald-500"
    },
    {
      icon: BarChart3,
      title: "Trend Analysis",
      description: "Understand emerging cultural trends and consumer behavior patterns before your competitors.",
      color: "from-purple-400 to-pink-500"
    },
    {
      icon: MessageCircle,
      title: "Conversational Interface",
      description: "Ask questions naturally and get detailed explanations in an intuitive chat format.",
      color: "from-indigo-400 to-blue-500"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your business data and conversations are protected with enterprise-grade security.",
      color: "from-red-400 to-pink-500"
    },
    {
      icon: Clock,
      title: "Instant Results",
      description: "Get comprehensive cultural analysis in seconds, not weeks of traditional research.",
      color: "from-teal-400 to-green-500"
    },
    {
      icon: Sparkles,
      title: "AI-Powered Intelligence",
      description: "Leverage advanced AI models to transform raw cultural data into actionable business strategies.",
      color: "from-violet-400 to-purple-500"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Powerful Features for 
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Smart Expansion</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Everything you need to understand, adapt, and succeed in any global market. 
            Our comprehensive feature set gives you the cultural intelligence edge.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 h-full">
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                
                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Transform Your Global Strategy?
            </h3>
            <p className="text-lg mb-6 text-blue-100">
              Join thousands of businesses already using Cultural AI to expand successfully worldwide.
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-white">10K+</div>
                <div className="text-sm text-blue-200">Businesses Served</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">150+</div>
                <div className="text-sm text-blue-200">Countries Covered</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">95%</div>
                <div className="text-sm text-blue-200">Success Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">24/7</div>
                <div className="text-sm text-blue-200">Availability</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
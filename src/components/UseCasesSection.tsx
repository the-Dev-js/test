import React from 'react';
import { motion } from 'framer-motion';
import { 
  Store, 
  Utensils, 
  Smartphone, 
  Briefcase, 
  Palette, 
  Plane,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const UseCasesSection = () => {
  const useCases = [
    {
      icon: Store,
      title: "E-commerce & Retail",
      scenario: "Launching products in new markets",
      example: "A fashion brand wants to expand to Japan",
      insights: [
        "Understand local fashion preferences and seasonal trends",
        "Identify popular colors, styles, and sizing preferences",
        "Learn about shopping behaviors and preferred platforms",
        "Discover cultural taboos and appropriate marketing messages"
      ],
      color: "from-pink-500 to-rose-600"
    },
    {
      icon: Utensils,
      title: "Food & Beverage",
      scenario: "Adapting menus for local tastes",
      example: "A restaurant chain entering the Middle Eastern market",
      insights: [
        "Discover halal requirements and dietary restrictions",
        "Learn about popular local flavors and spice preferences",
        "Understand meal timing and dining customs",
        "Identify trending food categories and ingredients"
      ],
      color: "from-orange-500 to-red-600"
    },
    {
      icon: Smartphone,
      title: "Technology & Apps",
      scenario: "Localizing digital products",
      example: "A social media app targeting Gen Z in Brazil",
      insights: [
        "Understand social media usage patterns and preferences",
        "Learn about popular content formats and features",
        "Discover cultural communication styles and emojis",
        "Identify local influencers and trending topics"
      ],
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: Briefcase,
      title: "B2B Services",
      scenario: "Understanding business culture",
      example: "A consulting firm expanding to Germany",
      insights: [
        "Learn about business etiquette and meeting protocols",
        "Understand decision-making processes and hierarchies",
        "Discover preferred communication styles and channels",
        "Identify key business values and relationship building"
      ],
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Palette,
      title: "Marketing & Advertising",
      scenario: "Creating culturally relevant campaigns",
      example: "A beauty brand launching in South Korea",
      insights: [
        "Understand beauty standards and skincare routines",
        "Learn about popular beauty influencers and trends",
        "Discover preferred marketing channels and messaging",
        "Identify cultural symbols and color preferences"
      ],
      color: "from-purple-500 to-violet-600"
    },
    {
      icon: Plane,
      title: "Travel & Hospitality",
      scenario: "Enhancing guest experiences",
      example: "A hotel chain improving services for Chinese tourists",
      insights: [
        "Learn about travel preferences and booking behaviors",
        "Understand cultural expectations for hospitality",
        "Discover popular activities and dining preferences",
        "Identify important cultural holidays and customs"
      ],
      color: "from-cyan-500 to-blue-600"
    }
  ];

  const benefits = [
    "Reduce market entry risks by 70%",
    "Increase customer engagement by 3x",
    "Accelerate time-to-market by 50%",
    "Improve ROI on marketing spend by 2.5x"
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Real-World 
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Use Cases</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            See how businesses across industries use Cultural AI to make smarter decisions, 
            avoid costly mistakes, and accelerate their global success.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${useCase.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                  <useCase.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {useCase.title}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    <strong>Scenario:</strong> {useCase.scenario}
                  </p>
                  <p className="text-sm text-gray-500 italic">
                    {useCase.example}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900 mb-3">Cultural Insights You'll Get:</h4>
                {useCase.insights.map((insight, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{insight}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
        >
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Measurable Business Impact
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Companies using Cultural AI see significant improvements in their global expansion metrics:
              </p>
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Success Story
              </h4>
              <blockquote className="text-gray-600 italic mb-4">
                "Cultural AI helped us understand Japanese consumer preferences before launching our skincare line. 
                We avoided a costly rebranding and achieved 40% higher sales than projected in our first quarter."
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full flex items-center justify-center">
                  <Palette className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Sarah Chen</div>
                  <div className="text-sm text-gray-500">VP Marketing, BeautyTech Inc.</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Your Industry, Your Success Story
            </h3>
            <p className="text-lg mb-6 text-blue-100">
              No matter what business you're in, Cultural AI can help you understand and succeed in any global market.
            </p>
            <button className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200">
              <span>Start Your Success Story</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default UseCasesSection;
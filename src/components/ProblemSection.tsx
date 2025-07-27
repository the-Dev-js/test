import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, TrendingDown, Globe, DollarSign } from 'lucide-react';

const ProblemSection = () => {
  const problems = [
    {
      icon: DollarSign,
      title: "Costly Market Failures",
      description: "Companies lose millions when products fail to resonate with local cultures, missing crucial cultural nuances that drive consumer behavior."
    },
    {
      icon: TrendingDown,
      title: "Missed Opportunities",
      description: "Without cultural intelligence, businesses overlook profitable market segments and fail to capitalize on local trends and preferences."
    },
    {
      icon: Globe,
      title: "Cultural Blind Spots",
      description: "Traditional market research often misses the deep cultural insights needed to truly understand what motivates consumers in different regions."
    },
    {
      icon: AlertTriangle,
      title: "Risky Assumptions",
      description: "Making business decisions based on assumptions rather than data-driven cultural insights leads to expensive mistakes and brand damage."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            The Challenge of 
            <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent"> Global Expansion</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Expanding into new markets without cultural intelligence is like navigating in the dark. 
            Here's what businesses face when they lack deep cultural understanding.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-red-100"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <problem.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {problem.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {problem.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-red-100 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              The Cost of Cultural Misunderstanding
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              Studies show that 60% of international business ventures fail due to cultural misalignment. 
              Don't let your business become another statistic.
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-red-600">60%</div>
                <div className="text-sm text-gray-500">Ventures Fail</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600">$2.3M</div>
                <div className="text-sm text-gray-500">Average Loss</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-600">18 Months</div>
                <div className="text-sm text-gray-500">Recovery Time</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemSection;
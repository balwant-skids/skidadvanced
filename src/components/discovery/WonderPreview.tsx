'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Heart, Brain, Activity, Eye, Ear, Thermometer } from 'lucide-react'
import Link from 'next/link'

const wonderPreviews = [
  {
    id: 'heart',
    title: 'The Amazing Heart',
    subtitle: 'Your Child\'s Powerful Engine',
    description: 'Discover how your child\'s heart beats 100,000 times a day, pumping life through their growing body.',
    wonderFact: 'A child\'s heart is only the size of their fist, but it\'s strong enough to pump blood to every cell in their body!',
    icon: Heart,
    color: 'cardiovascular',
    gradient: 'from-red-400 to-pink-600',
    image: '❤️',
    stats: { value: '100K', label: 'beats/day' }
  },
  {
    id: 'brain',
    title: 'The Incredible Brain',
    subtitle: 'The Universe in Their Head',
    description: 'Explore how your child\'s brain creates 1 million new connections every second during early development.',
    wonderFact: 'Your child\'s brain uses 20% of their body\'s energy - it\'s like having a supercomputer running 24/7!',
    icon: Brain,
    color: 'brain',
    gradient: 'from-purple-400 to-indigo-600',
    image: '🧠',
    stats: { value: '1M', label: 'connections/sec' }
  },
  {
    id: 'lungs',
    title: 'The Breathing Balloons',
    subtitle: 'Life-Giving Air Machines',
    description: 'See how your child\'s lungs work like magical balloons, bringing oxygen to every part of their body.',
    wonderFact: 'If you could unfold your child\'s lungs, they would cover half a tennis court!',
    icon: Activity,
    color: 'respiratory',
    gradient: 'from-cyan-400 to-blue-600',
    image: '🫁',
    stats: { value: '20K', label: 'breaths/day' }
  },
  {
    id: 'eyes',
    title: 'The Window Cameras',
    subtitle: 'High-Tech Vision System',
    description: 'Marvel at how your child\'s eyes process 36,000 bits of information every hour.',
    wonderFact: 'Your child\'s eyes can distinguish between 10 million different colors!',
    icon: Eye,
    color: 'sensory',
    gradient: 'from-amber-400 to-orange-600',
    image: '👁️',
    stats: { value: '36K', label: 'bits/hour' }
  }
]

export function WonderPreview() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
            Peek into the Wonder
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get a glimpse of the incredible discoveries waiting for you and your child. 
            Each organ tells an amazing story of growth, development, and wonder.
          </p>
        </motion.div>

        {/* Wonder Preview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {wonderPreviews.map((wonder, index) => {
            const Icon = wonder.icon
            
            return (
              <motion.div
                key={wonder.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 hover:shadow-2xl transition-all duration-500 cursor-pointer"
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${wonder.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
                
                {/* Content */}
                <div className="relative p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${wonder.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
                          {wonder.title}
                        </h3>
                        <p className="text-gray-600 font-medium">{wonder.subtitle}</p>
                      </div>
                    </div>
                    
                    {/* Floating Character */}
                    <motion.div
                      animate={{
                        y: [0, -10, 0],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="text-4xl"
                    >
                      {wonder.image}
                    </motion.div>
                  </div>

                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {wonder.description}
                  </p>

                  {/* Wonder Fact */}
                  <div className={`bg-gradient-to-r ${wonder.gradient} bg-opacity-10 rounded-xl p-4 mb-6`}>
                    <div className="flex items-start space-x-2">
                      <span className="text-2xl">✨</span>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Wonder Fact!</h4>
                        <p className="text-gray-700 text-sm">{wonder.wonderFact}</p>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <div className={`text-3xl font-bold bg-gradient-to-r ${wonder.gradient} bg-clip-text text-transparent`}>
                        {wonder.stats.value}
                      </div>
                      <div className="text-sm text-gray-600">{wonder.stats.label}</div>
                    </div>
                    
                    <Link
                      href={`/discovery/${wonder.id}`}
                      className={`flex items-center space-x-2 bg-gradient-to-r ${wonder.gradient} text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-300 group-hover:scale-105`}
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Hover Effect Particles */}
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`absolute w-2 h-2 bg-gradient-to-r ${wonder.gradient} rounded-full opacity-0 group-hover:opacity-60`}
                      style={{
                        left: `${20 + i * 15}%`,
                        top: `${10 + i * 10}%`,
                      }}
                      animate={{
                        y: [0, -20, 0],
                        opacity: [0, 0.6, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Discovery Journey Teaser */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 border border-blue-100 text-center"
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            This is Just the Beginning...
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Each organ system has its own immersive discovery experience with interactive elements, 
            3D visualizations, and age-appropriate activities you can do at home with your child.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {['Interactive 3D Models', 'Age-Based Stories', 'Home Activities', 'Expert Guidance'].map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white px-4 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-700"
              >
                ✨ {feature}
              </motion.div>
            ))}
          </div>

          <Link
            href="/discovery"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-brain-500 to-cardiovascular-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            <span>Start Full Discovery Journey</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Sparkles, Heart, Brain, Activity } from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
}

const quickQuestions = [
  "Tell me about my child's heart and circulation",
  "How does my child's brain develop?",
  "What care plans do you recommend?",
  "How do you screen for internet addiction?",
  "What makes SKIDS different from other clinics?"
]

const discoveryJourneys = {
  // Body Systems
  heart: { name: "Heart & Circulation", emoji: "❤️", duration: "15-18 min", fact: "Your child's heart beats 100,000 times per day!" },
  brain: { name: "Brain & Nervous System", emoji: "🧠", duration: "20-25 min", fact: "Your child's brain forms 1 million new connections every second!" },
  lungs: { name: "Lungs & Breathing", emoji: "🫁", duration: "15-18 min", fact: "Your child takes 20,000 breaths every day!" },
  eyes: { name: "Eyes & Vision", emoji: "👁️", duration: "15-18 min", fact: "Your child's eyes can distinguish 10 million different colors!" },
  ears: { name: "Ears & Hearing", emoji: "👂", duration: "15-18 min", fact: "Your child's ears help with both hearing and balance!" },
  digestive: { name: "Digestive System", emoji: "🍎", duration: "18-22 min", fact: "Your child's digestive system is 30 feet long!" },
  skin: { name: "Skin & Protection", emoji: "🛡️", duration: "15-18 min", fact: "Your child's skin is their largest organ!" },
  muscles: { name: "Muscles & Bones", emoji: "💪", duration: "18-22 min", fact: "Your child has over 600 muscles!" },
  immune: { name: "Immune System", emoji: "🛡️", duration: "18-22 min", fact: "Your child's immune system remembers every germ it fights!" },
  hormones: { name: "Hormones & Growth", emoji: "⚡", duration: "18-22 min", fact: "Growth hormone works while your child sleeps!" },
  kidneys: { name: "Kidneys & Filtering", emoji: "💧", duration: "15-18 min", fact: "Your child's kidneys filter 50 gallons of blood daily!" },

  // Developmental Domains
  learning: { name: "Cognitive Development", emoji: "🧠", duration: "20-25 min", fact: "Your child can only hold 7±2 items in working memory!" },
  language: { name: "Language Development", emoji: "🗣️", duration: "18-22 min", fact: "Children learn 9 new words every day during peak development!" },
  emotions: { name: "Social-Emotional Development", emoji: "❤️", duration: "20-25 min", fact: "Children experience over 30 different emotions!" },
  movement: { name: "Motor Development", emoji: "🏃", duration: "18-22 min", fact: "Your brain creates new movement patterns with practice!" },
  senses: { name: "Sensory Processing", emoji: "🌈", duration: "20-25 min", fact: "You have more than 5 senses - actually 7 or more!" }
}

const drSkidsResponses = {
  greeting: "Hello! I'm Dr. SKIDS, your friendly health discovery guide! 👨‍⚕️ I'm here to help you explore your child's amazing body and development. We have 16 incredible discovery journeys covering everything from the heart to emotions! What would you like to learn about today?",

  // Body Systems Responses
  heart: "The heart is absolutely amazing! ❤️ Your child's heart is like a powerful pump that beats 100,000 times per day, sending blood to every part of their body. Our Heart & Circulation discovery journey (15-18 min) shows how this incredible organ works. Would you like to start exploring?",

  brain: "The brain is the most fascinating organ! 🧠 Your child's brain forms 1 million new connections every second and never stops learning. We have both a Brain & Nervous System journey and a Cognitive Development journey that explore how thinking and learning work. Which interests you more?",

  lungs: "Breathing is so important! 🫁 Your child takes about 20,000 breaths every day, bringing oxygen to their whole body. Our Lungs & Breathing journey (15-18 min) shows this amazing process. Want to discover how it all works?",

  eyes: "Vision is incredible! 👁️ Your child's eyes can distinguish 10 million different colors and process 36,000 bits of information per hour. Our Eyes & Vision journey explores this amazing sense. Ready to see how sight works?",

  ears: "Hearing is fascinating! 👂 Your child's ears don't just hear - they also help with balance! Our Ears & Hearing journey shows how sound travels and how balance works. Want to explore this amazing system?",

  digestive: "The digestive system is amazing! 🍎 It's like a 30-foot-long food processing factory that turns meals into energy. Our Digestive System journey (18-22 min) shows this incredible process. Ready to explore?",

  // Developmental Responses
  emotions: "Emotions are so important! ❤️ Children experience over 30 different emotions, and learning to understand them is crucial for healthy relationships. Our Social-Emotional Development journey (20-25 min) explores feelings, empathy, and social skills. Want to dive in?",

  language: "Language development is amazing! 🗣️ Children learn about 9 new words every day during peak development years. Our Language Development journey (18-22 min) covers speech, vocabulary, and communication skills. Ready to explore?",

  movement: "Motor skills are so important! 🏃 Your brain literally creates new movement patterns every time your child practices a skill. Our Motor Development journey (18-22 min) covers both gross and fine motor skills. Want to learn more?",

  senses: "Sensory processing is incredible! 🌈 Your child actually has more than 5 senses - they have 7 or more! Our Sensory Processing journey (20-25 min) explores how all the senses work together. Ready to discover this amazing system?",

  // General responses
  development: "Every child develops at their own amazing pace! We have 5 developmental domain journeys covering cognitive, language, social-emotional, motor, and sensory development. Each one is filled with wonder facts and activities. Which area interests you most?",

  activities: "I love that you want to support your child's development! 🌟 Each of our 16 discovery journeys includes hands-on activities you can do together. Whether it's heart-healthy exercises, brain games, or emotion recognition activities - there's something for every interest!",

  recommend: "Based on what you're asking about, I'd recommend starting with our [JOURNEY] discovery journey! It's [DURATION] of amazing exploration with interactive elements, wonder facts, and fun activities. Would you like me to guide you there?",

  // Care Plans Responses
  carePlans: "We offer three comprehensive care plans! 🌟 Our Essential Care (₹299/month) covers quarterly screenings and digital wellness checks. Comprehensive Care (₹499/month) adds vision, hearing, and hemoglobin testing. Premium Care (₹799/month) includes unlimited specialized assessments. All plans use FDA-approved, non-invasive devices and follow AAP/IAP recommendations. Which interests you most?",

  internetAddiction: "Internet addiction is the biggest threat to child development today! 📱 Our specialized digital wellness screening assesses screen time impact, behavioral changes, and provides personalized intervention plans. We use research-validated tools to identify early warning signs and help families establish healthy digital habits. This screening is included in all our care plans!",

  skidsDifference: "SKIDS is unique because we use FDA/CE approved, research-validated NON-INVASIVE devices for all testing! 🏥 No painful procedures - just advanced technology like spectroscopy for hemoglobin testing and specialized audiometry for hearing. We follow AAP & IAP recommendations and provide head-to-toe screening that most clinics don't offer. Plus, we're the only clinic specifically addressing internet addiction in children!",

  screening: "Our comprehensive screening covers everything from head-to-toe! We check growth, development, vision (including amblyopia), hearing, hemoglobin levels, and behavioral health - all using non-invasive, FDA-approved devices. We also screen for internet addiction, which is crucial in today's digital age. Most importantly, everything is pain-free and child-friendly!",

  vaccination: "We provide complete vaccination schedules following IAP and WHO guidelines! 💉 Our care plan members get 10-20% discounts on all vaccinations, plus we track your child's immunization schedule and send reminders. We make vaccination stress-free for both children and parents with our gentle approach and distraction techniques.",

  // Behavioral Assessment Responses
  behavioral: "Our behavioral assessment center supports your child's emotional well-being! 🧠 All plans include SKIDS Clinic Chatter - our gentle, conversation-based assessment tool that makes understanding your child's development comfortable and insightful. Higher plans add specialized evaluations when needed. How can I help you learn more about supporting your child's behavioral health?",

  chatter: "SKIDS Clinic Chatter creates a comfortable, conversation-based approach to understanding your child's development! 💬 It's designed to be engaging and stress-free, taking 15-20 minutes to provide valuable insights about your child's emotional and behavioral well-being. It's included in all our care plans as part of our comprehensive approach to child health!",

  specializedBehavioral: "When additional support is needed, our specialized assessments provide deeper insights into areas like attention, learning styles, social development, and emotional well-being! 🎯 We use evidence-based, child-friendly approaches with tools like developmental questionnaires and interactive assessments. Our goal is always to help families understand and support their child's unique development journey."
}

export function DrSkidsChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: drSkidsResponses.greeting,
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate Dr. SKIDS response
    setTimeout(() => {
      const botResponse = generateResponse(content)
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 1500)
  }

  const generateResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    // Body Systems
    if (input.includes('heart') || input.includes('circulation') || input.includes('blood') || input.includes('cardiovascular')) {
      return drSkidsResponses.heart
    }
    if (input.includes('brain') || input.includes('nervous') || input.includes('neurons') || input.includes('thinking')) {
      return drSkidsResponses.brain
    }
    if (input.includes('lungs') || input.includes('breathing') || input.includes('respiratory') || input.includes('oxygen')) {
      return drSkidsResponses.lungs
    }
    if (input.includes('eyes') || input.includes('vision') || input.includes('sight') || input.includes('seeing')) {
      return drSkidsResponses.eyes
    }
    if (input.includes('ears') || input.includes('hearing') || input.includes('sound') || input.includes('balance')) {
      return drSkidsResponses.ears
    }
    if (input.includes('digestive') || input.includes('stomach') || input.includes('food') || input.includes('eating')) {
      return drSkidsResponses.digestive
    }

    // Developmental Domains
    if (input.includes('emotions') || input.includes('feelings') || input.includes('social') || input.includes('empathy')) {
      return drSkidsResponses.emotions
    }
    if (input.includes('language') || input.includes('speech') || input.includes('talking') || input.includes('words')) {
      return drSkidsResponses.language
    }
    if (input.includes('movement') || input.includes('motor') || input.includes('coordination') || input.includes('physical')) {
      return drSkidsResponses.movement
    }
    if (input.includes('senses') || input.includes('sensory') || input.includes('processing') || input.includes('touch')) {
      return drSkidsResponses.senses
    }

    // Care Plans and Services
    if (input.includes('care plan') || input.includes('subscription') || input.includes('plan') || input.includes('pricing')) {
      return drSkidsResponses.carePlans
    }
    if (input.includes('internet') || input.includes('screen time') || input.includes('digital') || input.includes('addiction')) {
      return drSkidsResponses.internetAddiction
    }
    if (input.includes('different') || input.includes('unique') || input.includes('why skids') || input.includes('special')) {
      return drSkidsResponses.skidsDifference
    }
    if (input.includes('screening') || input.includes('test') || input.includes('check') || input.includes('assessment')) {
      return drSkidsResponses.screening
    }
    if (input.includes('vaccination') || input.includes('vaccine') || input.includes('immunization')) {
      return drSkidsResponses.vaccination
    }
    if (input.includes('behavioral') || input.includes('mental health') || input.includes('behavior')) {
      return drSkidsResponses.behavioral
    }
    if (input.includes('chatter') || input.includes('conversational') || input.includes('ai assessment')) {
      return drSkidsResponses.chatter
    }
    if (input.includes('adhd') || input.includes('autism') || input.includes('anxiety') || input.includes('specialized')) {
      return drSkidsResponses.specializedBehavioral
    }

    // General topics
    if (input.includes('development') || input.includes('milestone') || input.includes('growing')) {
      return drSkidsResponses.development
    }
    if (input.includes('activities') || input.includes('exercise') || input.includes('play')) {
      return drSkidsResponses.activities
    }
    if (input.includes('learning') || input.includes('cognitive') || input.includes('memory')) {
      return drSkidsResponses.brain
    }

    // Default response with journey recommendations
    const journeyCount = Object.keys(discoveryJourneys).length
    return `That's a wonderful question! 🌟 I have knowledge about all ${journeyCount} of our discovery journeys covering body systems and development. Try asking about specific topics like "heart," "emotions," "language," or "movement" and I can guide you to the perfect exploration! What interests you most about your child's amazing body and development?`
  }

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question)
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-brain-500 to-cardiovascular-500 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <MessageCircle className="w-6 h-6 text-white" />
              {/* Notification Dot */}
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 z-50 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-brain-500 to-cardiovascular-500 p-4 text-white">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-xl">👨‍⚕️</span>
                </div>
                <div>
                  <h3 className="font-semibold">Dr. SKIDS</h3>
                  <p className="text-sm text-white/90">Your Health Discovery Guide</p>
                </div>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="ml-auto"
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-brain-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 p-3 rounded-2xl">
                    <div className="flex space-x-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                          className="w-2 h-2 bg-gray-400 rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Quick Questions */}
              {messages.length === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-2"
                >
                  <p className="text-xs text-gray-500 text-center">Quick questions to get started:</p>
                  {quickQuestions.map((question, index) => (
                    <motion.button
                      key={question}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      onClick={() => handleQuickQuestion(question)}
                      className="w-full text-left p-2 text-xs bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
                    >
                      {question}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                  placeholder="Ask Dr. SKIDS anything..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-brain-500 focus:border-transparent text-sm"
                />
                <button
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={!inputValue.trim()}
                  className="w-10 h-10 bg-gradient-to-r from-brain-500 to-cardiovascular-500 rounded-full flex items-center justify-center text-white hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

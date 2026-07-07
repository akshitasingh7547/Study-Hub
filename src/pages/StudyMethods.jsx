import React, { useState } from 'react'
import { BookOpen, Brain, Zap, CheckCircle2, Timer } from 'lucide-react'

const StudyMethods = () => {
  const [selectedMethod, setSelectedMethod] = useState(null)

  const methods = [
    {
      id: 1,
      name: 'Active Recall',
      icon: Brain,
      description: 'Testing your memory instead of just rereading your notes.',
      bestFor: 'Exam preparation and flashcards.',
      steps: [
        'Read a section of material',
        'Close the book or notes',
        'Try to recall everything you remember',
        'Check your accuracy',
        'Review areas you missed'
      ],
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 2,
      name: 'Spaced Repetition',
      icon: Timer,
      description: 'Reviewing material at increasing intervals.',
      bestFor: 'Long-term retention of difficult concepts.',
      steps: [
        'Review material on Day 1',
        'Review again on Day 3',
        'Review on Day 7',
        'Review on Day 14',
        'Review on Day 30'
      ],
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 3,
      name: 'The Feynman Technique',
      icon: BookOpen,
      description: 'Learning a topic and explaining it in simple terms.',
      bestFor: 'Deeply understanding complex theories.',
      steps: [
        'Pick a topic to learn',
        'Pretend you\'re teaching it to a child',
        'Use simple language, no jargon',
        'Identify gaps in your understanding',
        'Refine your explanation'
      ],
      color: 'from-green-500 to-green-600'
    },
    {
      id: 4,
      name: 'Blurting Method',
      icon: Zap,
      description: 'Reading a section, then writing what you remember.',
      bestFor: 'Quick self-testing before an exam.',
      steps: [
        'Read a section carefully',
        'Put away the material',
        'Write down everything you remember',
        'Check accuracy against original',
        'Note areas needing more review'
      ],
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 5,
      name: 'Pomodoro Technique',
      icon: CheckCircle2,
      description: 'Study for 25 mins, 5-min break. Repeat 4 times.',
      bestFor: 'Beating procrastination and maintaining focus.',
      steps: [
        'Set timer for 25 minutes',
        'Study with full focus',
        'Take 5-minute break',
        'Repeat 3 more times',
        'Take 15-30 minute break after 4 cycles'
      ],
      color: 'from-red-500 to-red-600'
    }
  ]

  return (
    <div className="p-8 animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slytherin-900 mb-2">Study Methods 📚</h1>
        <p className="text-slytherin-600">Master scientific study techniques to boost your grades</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {methods.map((method) => {
          const IconComponent = method.icon
          return (
            <div
              key={method.id}
              onClick={() => setSelectedMethod(selectedMethod === method.id ? null : method.id)}
              className={`bg-gradient-to-br ${method.color} rounded-xl shadow-lg p-6 text-white cursor-pointer hover:shadow-xl transition transform hover:scale-105`}
            >
              <IconComponent size={32} className="mb-3" />
              <h3 className="text-xl font-bold mb-2">{method.name}</h3>
              <p className="text-sm opacity-90">{method.description}</p>
            </div>
          )
        })}
      </div>

      {selectedMethod && (
        <div className="bg-white rounded-xl shadow-lg p-8 animate-slideIn">
          {methods.map(method => {
            if (method.id !== selectedMethod) return null
            return (
              <div key={method.id}>
                <h2 className="text-3xl font-bold text-slytherin-900 mb-2">{method.name}</h2>
                <p className="text-slytherin-600 mb-6">{method.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-bold text-slytherin-900 mb-4">Best Used For</h3>
                    <p className="text-slytherin-700 bg-slytherin-50 p-4 rounded-lg">
                      {method.bestFor}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-slytherin-900 mb-4">Steps</h3>
                    <ol className="space-y-2">
                      {method.steps.map((step, i) => (
                        <li key={i} className="flex gap-3 text-slytherin-700">
                          <span className="font-bold text-slytherin-600 min-w-6">{i + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default StudyMethods

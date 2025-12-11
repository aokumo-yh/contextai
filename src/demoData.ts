import { DemoScenario } from './types';

export const demoScenarios: DemoScenario[] = [
  {
    name: 'US-Japan Business Meeting',
    description: 'Direct American style meets formal Japanese protocol',
    yourCulture: 'US Tech',
    theirCulture: 'Japanese Corporate',
    transcript: [
      {
        timestamp: new Date(Date.now() - 120000),
        speaker: 'You',
        text: 'Hey team! Let\'s dive right in. I think we should pivot the strategy completely.',
      },
      {
        timestamp: new Date(Date.now() - 115000),
        speaker: 'Them',
        text: 'Thank you for sharing your perspective. We will need to carefully consider...',
      },
      {
        timestamp: new Date(Date.now() - 110000),
        speaker: 'You',
        text: 'Actually, can we just decide now? Time is money.',
      },
      {
        timestamp: new Date(Date.now() - 105000),
        speaker: 'Them',
        text: 'I understand. However, we must consult with our senior management first.',
      },
      {
        timestamp: new Date(Date.now() - 100000),
        speaker: 'You',
        text: 'But that will take weeks! Can\'t you just make the call?',
      },
    ],
    insights: [
      {
        timestamp: new Date(Date.now() - 118000),
        urgency: 'alert',
        icon: '⚡',
        text: 'Too direct! Japanese culture values consensus and hierarchy. Suggesting a "pivot" without preparation may cause loss of face.',
      },
      {
        timestamp: new Date(Date.now() - 108000),
        urgency: 'critical',
        icon: '🚨',
        text: 'Pressuring for immediate decisions violates Japanese business protocol. This could damage the relationship permanently.',
      },
      {
        timestamp: new Date(Date.now() - 102000),
        urgency: 'calm',
        icon: '💡',
        text: 'Suggestion: Acknowledge their process. Say "I appreciate your thorough approach. How can we support the decision-making process?"',
      },
    ],
  },
  {
    name: 'German-US Tech Pitch',
    description: 'Casual startup pitch meets German precision',
    yourCulture: 'German Business',
    theirCulture: 'US Tech',
    transcript: [
      {
        timestamp: new Date(Date.now() - 90000),
        speaker: 'Them',
        text: 'So yeah, we\'re gonna disrupt the entire industry! It\'s going to be HUGE!',
      },
      {
        timestamp: new Date(Date.now() - 85000),
        speaker: 'You',
        text: 'Can you provide specific metrics and timelines for these projections?',
      },
      {
        timestamp: new Date(Date.now() - 80000),
        speaker: 'Them',
        text: 'Well, we\'re still figuring that out, but trust me, the vision is solid!',
      },
      {
        timestamp: new Date(Date.now() - 75000),
        speaker: 'You',
        text: 'Without concrete data, it is difficult to evaluate the feasibility of this proposal.',
      },
    ],
    insights: [
      {
        timestamp: new Date(Date.now() - 87000),
        urgency: 'calm',
        icon: '📊',
        text: 'Good approach! Germans value precision and data. Your request for metrics aligns with cultural expectations.',
      },
      {
        timestamp: new Date(Date.now() - 82000),
        urgency: 'alert',
        icon: '⚠️',
        text: 'Cultural gap detected: US Tech culture often leads with vision and excitement, while German culture requires detailed planning first.',
      },
      {
        timestamp: new Date(Date.now() - 76000),
        urgency: 'calm',
        icon: '💡',
        text: 'Consider: Balance your need for data with acknowledgment of their vision. "I love the vision. To move forward, we\'ll need X, Y, Z metrics."',
      },
    ],
  },
  {
    name: 'US-German Contract Negotiation',
    description: 'Flexible American approach meets rigid German structure',
    yourCulture: 'US Tech',
    theirCulture: 'German Business',
    transcript: [
      {
        timestamp: new Date(Date.now() - 60000),
        speaker: 'You',
        text: 'Let\'s keep this flexible. We can adjust terms as we go along.',
      },
      {
        timestamp: new Date(Date.now() - 55000),
        speaker: 'Them',
        text: 'We require all terms to be explicitly defined in the contract before signing.',
      },
      {
        timestamp: new Date(Date.now() - 50000),
        speaker: 'You',
        text: 'Come on, we\'re all friends here. Trust me, we\'ll figure it out.',
      },
      {
        timestamp: new Date(Date.now() - 45000),
        speaker: 'Them',
        text: 'This is not about trust. It is about proper business procedure.',
      },
    ],
    insights: [
      {
        timestamp: new Date(Date.now() - 57000),
        urgency: 'critical',
        icon: '🚨',
        text: 'Major cultural mismatch! Germans view detailed contracts as showing respect and professionalism, not distrust.',
      },
      {
        timestamp: new Date(Date.now() - 52000),
        urgency: 'critical',
        icon: '⛔',
        text: 'Suggesting friendship over formal process may be seen as unprofessional. Germans separate personal and business relationships strictly.',
      },
      {
        timestamp: new Date(Date.now() - 46000),
        urgency: 'calm',
        icon: '💡',
        text: 'Recommendation: "You\'re absolutely right. Let\'s ensure we document everything properly. What specific terms should we clarify?"',
      },
    ],
  },
  {
    name: 'Japanese "Soft No" Detection',
    description: 'Learn to detect polite refusals in Japanese business culture',
    yourCulture: 'US Tech',
    theirCulture: 'Japanese Corporate',
    transcript: [
      {
        timestamp: new Date(Date.now() - 40000),
        speaker: 'You',
        text: 'So, can we move forward with this partnership next quarter?',
      },
      {
        timestamp: new Date(Date.now() - 35000),
        speaker: 'Them',
        text: '前向きに検討します',
        originalText: '前向きに検討します',
        translatedText: 'I will consider it positively',
        language: 'ja-JP',
      },
      {
        timestamp: new Date(Date.now() - 30000),
        speaker: 'You',
        text: 'Great! So that\'s a yes then?',
      },
      {
        timestamp: new Date(Date.now() - 25000),
        speaker: 'Them',
        text: 'それは難しいですね',
        originalText: 'それは難しいですね',
        translatedText: 'That is difficult',
        language: 'ja-JP',
      },
    ],
    insights: [
      {
        timestamp: new Date(Date.now() - 36000),
        urgency: 'critical',
        icon: '🚨',
        text: 'SOFT NO DETECTED',
        originalText: '前向きに検討します',
        translatedText: 'I will consider it positively',
        culturalMeaning: 'This is a polite NO in Japanese business culture. "前向きに検討します" (maemuki ni kentou shimasu) literally means "I will consider it positively" but is a standard phrase used to politely decline without direct confrontation.',
        suggestion: 'Do NOT assume this is agreement. Instead, ask: "What concerns do you have that we should address?" or "What additional information would help your decision?"',
      },
      {
        timestamp: new Date(Date.now() - 31000),
        urgency: 'critical',
        icon: '⚠️',
        text: 'You misinterpreted the soft no as agreement! This could damage trust and make you appear culturally insensitive.',
        suggestion: 'Acknowledge their hesitation gracefully: "I understand this requires careful consideration. What timeline works best for your team?"',
      },
      {
        timestamp: new Date(Date.now() - 26000),
        urgency: 'alert',
        icon: '🔍',
        text: 'ANOTHER SOFT NO',
        originalText: 'それは難しいですね',
        translatedText: 'That is difficult',
        culturalMeaning: '"難しい" (muzukashii) meaning "difficult" is another common Japanese soft no. They are signaling that the proposal is not acceptable without directly saying no.',
        suggestion: 'Recognize the pattern and pivot: "I completely understand. Perhaps we could explore alternative approaches that better fit your requirements?"',
      },
    ],
  },
];

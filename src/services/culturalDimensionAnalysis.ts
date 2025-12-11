import { Culture, TranscriptEntry } from '../types';

export interface CulturalDimensions {
  Communication: number;
  Evaluation: number;
  Persuasion: number;
  Leading: number;
  Deciding: number;
  Trusting: number;
  Disagreeing: number;
  Scheduling: number;
}

interface PatternMatch {
  dimension: keyof CulturalDimensions;
  weight: number;
  direction: 'high' | 'low';
}

const communicationPatterns = {
  indirect: [
    'consider it', 'think about it', 'may be', 'might be', 'perhaps',
    'could be', 'we will see', 'let me check', 'need to consult'
  ],
  direct: [
    'yes', 'no', 'will do', 'cannot', 'won\'t', 'definitely',
    'absolutely', 'clearly', 'obviously'
  ]
};

const evaluationPatterns = {
  indirect: [
    'interesting approach', 'one way to look at it', 'we could explore',
    'consider another perspective', 'room for improvement'
  ],
  direct: [
    'wrong', 'mistake', 'incorrect', 'bad idea', 'failed',
    'not good', 'problem with', 'issue with'
  ]
};

const persuasionPatterns = {
  principleFirst: [
    'according to', 'research shows', 'data indicates', 'studies prove',
    'evidence suggests', 'theory', 'principle', 'framework'
  ],
  applicationFirst: [
    'in practice', 'for example', 'case study', 'real world',
    'proven results', 'worked before', 'trust me', 'experience shows'
  ]
};

const leadingPatterns = {
  hierarchical: [
    'senior management', 'approval from', 'proper channels', 'chain of command',
    'authorized by', 'permission', 'superior', 'respect protocol'
  ],
  egalitarian: [
    'team decision', 'let\'s discuss', 'what do you think', 'everyone\'s input',
    'collaborative', 'flat structure', 'open to ideas'
  ]
};

const decidingPatterns = {
  consensus: [
    'need to consult', 'team agreement', 'discuss with stakeholders',
    'everyone aligned', 'collective decision', 'group input'
  ],
  topDown: [
    'i decide', 'my call', 'executive decision', 'move fast',
    'just do it', 'don\'t need approval', 'quick decision'
  ]
};

const trustingPatterns = {
  relationship: [
    'build relationship', 'get to know', 'long term partnership',
    'trust first', 'personal connection', 'friendship'
  ],
  task: [
    'credentials', 'track record', 'portfolio', 'metrics',
    'results', 'performance', 'proven success'
  ]
};

const disagreeingPatterns = {
  avoids: [
    'that\'s one way', 'interesting point', 'let me think',
    'difficult', 'challenging', 'need to consider'
  ],
  confrontational: [
    'i disagree', 'not true', 'wrong about', 'i don\'t think so',
    'have to push back', 'cannot accept'
  ]
};

const schedulingPatterns = {
  flexible: [
    'whenever works', 'flexible timing', 'we can adjust',
    'not urgent', 'as needed', 'organic timeline'
  ],
  linear: [
    'deadline', 'specific date', 'timeline', 'schedule',
    'punctual', 'on time', 'strict timing', 'precise'
  ]
};

function analyzePatterns(text: string): PatternMatch[] {
  const lowerText = text.toLowerCase();
  const matches: PatternMatch[] = [];

  if (communicationPatterns.indirect.some(p => lowerText.includes(p))) {
    matches.push({ dimension: 'Communication', weight: 1, direction: 'high' });
  }
  if (communicationPatterns.direct.some(p => lowerText.includes(p))) {
    matches.push({ dimension: 'Communication', weight: 1, direction: 'low' });
  }

  if (evaluationPatterns.indirect.some(p => lowerText.includes(p))) {
    matches.push({ dimension: 'Evaluation', weight: 1, direction: 'high' });
  }
  if (evaluationPatterns.direct.some(p => lowerText.includes(p))) {
    matches.push({ dimension: 'Evaluation', weight: 1, direction: 'low' });
  }

  if (persuasionPatterns.principleFirst.some(p => lowerText.includes(p))) {
    matches.push({ dimension: 'Persuasion', weight: 1, direction: 'low' });
  }
  if (persuasionPatterns.applicationFirst.some(p => lowerText.includes(p))) {
    matches.push({ dimension: 'Persuasion', weight: 1, direction: 'high' });
  }

  if (leadingPatterns.hierarchical.some(p => lowerText.includes(p))) {
    matches.push({ dimension: 'Leading', weight: 1, direction: 'high' });
  }
  if (leadingPatterns.egalitarian.some(p => lowerText.includes(p))) {
    matches.push({ dimension: 'Leading', weight: 1, direction: 'low' });
  }

  if (decidingPatterns.consensus.some(p => lowerText.includes(p))) {
    matches.push({ dimension: 'Deciding', weight: 1, direction: 'low' });
  }
  if (decidingPatterns.topDown.some(p => lowerText.includes(p))) {
    matches.push({ dimension: 'Deciding', weight: 1, direction: 'high' });
  }

  if (trustingPatterns.relationship.some(p => lowerText.includes(p))) {
    matches.push({ dimension: 'Trusting', weight: 1, direction: 'high' });
  }
  if (trustingPatterns.task.some(p => lowerText.includes(p))) {
    matches.push({ dimension: 'Trusting', weight: 1, direction: 'low' });
  }

  if (disagreeingPatterns.avoids.some(p => lowerText.includes(p))) {
    matches.push({ dimension: 'Disagreeing', weight: 1, direction: 'high' });
  }
  if (disagreeingPatterns.confrontational.some(p => lowerText.includes(p))) {
    matches.push({ dimension: 'Disagreeing', weight: 1, direction: 'low' });
  }

  if (schedulingPatterns.flexible.some(p => lowerText.includes(p))) {
    matches.push({ dimension: 'Scheduling', weight: 1, direction: 'high' });
  }
  if (schedulingPatterns.linear.some(p => lowerText.includes(p))) {
    matches.push({ dimension: 'Scheduling', weight: 1, direction: 'low' });
  }

  return matches;
}

const culturalBaselines: Record<Culture, CulturalDimensions> = {
  'US Tech': {
    Communication: 2,
    Evaluation: 3,
    Persuasion: 8,
    Leading: 2,
    Deciding: 7,
    Trusting: 2,
    Disagreeing: 2,
    Scheduling: 3,
  },
  'Japanese Corporate': {
    Communication: 9,
    Evaluation: 9,
    Persuasion: 3,
    Leading: 9,
    Deciding: 2,
    Trusting: 9,
    Disagreeing: 10,
    Scheduling: 2,
  },
  'German Business': {
    Communication: 1,
    Evaluation: 1,
    Persuasion: 2,
    Leading: 3,
    Deciding: 3,
    Trusting: 2,
    Disagreeing: 1,
    Scheduling: 1,
  },
};

export function analyzeCulturalDimensions(
  transcript: TranscriptEntry[],
  speaker: 'You' | 'Them',
  baseCulture: Culture
): CulturalDimensions {
  const speakerMessages = transcript.filter(entry => entry.speaker === speaker);

  if (speakerMessages.length === 0) {
    return culturalBaselines[baseCulture];
  }

  const dimensionScores: Record<keyof CulturalDimensions, { high: number; low: number }> = {
    Communication: { high: 0, low: 0 },
    Evaluation: { high: 0, low: 0 },
    Persuasion: { high: 0, low: 0 },
    Leading: { high: 0, low: 0 },
    Deciding: { high: 0, low: 0 },
    Trusting: { high: 0, low: 0 },
    Disagreeing: { high: 0, low: 0 },
    Scheduling: { high: 0, low: 0 },
  };

  speakerMessages.forEach(message => {
    const matches = analyzePatterns(message.text);
    matches.forEach(match => {
      dimensionScores[match.dimension][match.direction] += match.weight;
    });
  });

  const baseline = culturalBaselines[baseCulture];
  const result: CulturalDimensions = { ...baseline };

  Object.keys(dimensionScores).forEach(dimension => {
    const dim = dimension as keyof CulturalDimensions;
    const high = dimensionScores[dim].high;
    const low = dimensionScores[dim].low;
    const total = high + low;

    if (total > 0) {
      const ratio = high / total;
      const observedScore = Math.round(ratio * 10);

      result[dim] = Math.round((baseline[dim] * 0.4) + (observedScore * 0.6));

      result[dim] = Math.max(0, Math.min(10, result[dim]));
    }
  });

  return result;
}

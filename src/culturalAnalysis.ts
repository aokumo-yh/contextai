import { Culture, Insight, UrgencyLevel } from './types';

interface TriggerResult {
  triggered: boolean;
  insight?: Omit<Insight, 'id'>;
}

const culturalTriggers = {
  'Japanese Corporate': {
    softNo: {
      patterns: ['consider it', 'think about it', 'difficult', 'may be challenging', 'we will try', 'we will do our best', 'that might be', 'consider it positively'],
      insight: {
        urgency: 'critical' as UrgencyLevel,
        icon: '🚨',
        text: 'This is a SOFT NO in Japanese business culture. The person is declining politely but cannot say "no" directly. Do not push further. Instead, ask about their concerns and offer to help address them.',
        timestamp: new Date(),
      },
    },
    directCriticism: {
      patterns: ['wrong', 'bad', 'not good', 'mistake', 'failed', 'problem with', 'issue with'],
      insight: {
        urgency: 'alert' as UrgencyLevel,
        icon: '⚡',
        text: 'Direct criticism damages relationships in Japanese culture. Soften your language: "Perhaps we could explore...", "What if we tried...", or "I wonder if..."',
        timestamp: new Date(),
      },
    },
    silence: {
      insight: {
        urgency: 'calm' as UrgencyLevel,
        icon: '💭',
        text: 'Extended silence in Japanese culture often indicates thoughtful consideration, disagreement they cannot express directly, or a polite way of declining. Wait patiently—do not fill the silence.',
        timestamp: new Date(),
      },
    },
    rushing: {
      patterns: ['need to decide now', 'right away', 'immediately', 'asap', 'hurry', 'quickly'],
      insight: {
        urgency: 'critical' as UrgencyLevel,
        icon: '⏰',
        text: 'Pushing for immediate decisions violates Japanese business protocol. Japanese culture values consensus and proper consultation with stakeholders. Allow time for proper decision-making processes.',
        timestamp: new Date(),
      },
    },
  },
  'US Tech': {
    slowDecisions: {
      patterns: ['need approval', 'need to check', 'need to consult', 'take time to think', 'meeting next week'],
      insight: {
        urgency: 'alert' as UrgencyLevel,
        icon: '⏳',
        text: 'US Tech culture moves fast and expects quick decisions. Extended deliberation may be seen as lack of confidence or slow execution. Consider proposing a faster decision timeline.',
        timestamp: new Date(),
      },
    },
    tooFormal: {
      patterns: ['protocol', 'procedure', 'proper channels', 'officially', 'documentation'],
      insight: {
        urgency: 'calm' as UrgencyLevel,
        icon: 'ℹ️',
        text: 'US Tech culture tends to be informal and flexible. Emphasis on proper procedures may slow things down. Consider streamlining processes where possible.',
        timestamp: new Date(),
      },
    },
  },
  'German Business': {
    vague: {
      patterns: ['maybe', 'perhaps', 'we will see', 'it depends', 'let\'s discuss', 'could be'],
      insight: {
        urgency: 'alert' as UrgencyLevel,
        icon: '❓',
        text: 'German culture requires explicit, detailed specifications. Vague statements raise concerns. Provide concrete facts, figures, and timelines instead.',
        timestamp: new Date(),
      },
    },
    emotionalAppeal: {
      patterns: ['trust me', 'just believe', 'i have a feeling', 'intuition', 'passion'],
      insight: {
        urgency: 'alert' as UrgencyLevel,
        icon: '💭',
        text: 'German business culture values logic over emotion. Back emotional appeals with data, research, and concrete evidence to be persuasive.',
        timestamp: new Date(),
      },
    },
    rushing: {
      patterns: ['need to decide now', 'right away', 'asap', 'hurry'],
      insight: {
        urgency: 'critical' as UrgencyLevel,
        icon: '⏰',
        text: 'Germans need time for thorough planning. Rushing decisions is seen as unprofessional. Allow adequate time for proper analysis and planning.',
        timestamp: new Date(),
      },
    },
  },
};

function checkPatterns(text: string, patterns: string[]): boolean {
  const lowerText = text.toLowerCase();
  return patterns.some(pattern => lowerText.includes(pattern.toLowerCase()));
}

export function analyzeCultural(
  text: string,
  theirCulture: Culture,
  lastTranscriptIndex: number
): TriggerResult {
  if (!text || text.length < 3) {
    return { triggered: false };
  }

  const triggers = culturalTriggers[theirCulture] as any;

  if (!triggers) {
    return { triggered: false };
  }

  for (const [triggerKey, triggerData] of Object.entries(triggers)) {
    if (triggerKey === 'silence') continue;

    if ('patterns' in triggerData && triggerData.patterns) {
      if (checkPatterns(text, triggerData.patterns)) {
        return {
          triggered: true,
          insight: triggerData.insight,
        };
      }
    }
  }

  return { triggered: false };
}

export function checkForSilence(duration: number, theirCulture: Culture): TriggerResult {
  if (duration < 3000) {
    return { triggered: false };
  }

  if (theirCulture === 'Japanese Corporate') {
    return {
      triggered: true,
      insight: (culturalTriggers['Japanese Corporate'] as any).silence.insight,
    };
  }

  return { triggered: false };
}

export function generateSilenceInsight(duration: number, _culture: Culture): Omit<Insight, 'id'> {
  const seconds = Math.floor(duration / 1000);
  return {
    urgency: 'calm' as UrgencyLevel,
    icon: '⏸️',
    text: `Silence detected (${seconds}s). In some cultures, silence indicates thoughtful consideration or disagreement that cannot be expressed directly. Avoid filling the silence—wait patiently.`,
    timestamp: new Date(),
  };
}

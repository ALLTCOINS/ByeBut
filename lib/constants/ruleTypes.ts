export const RULE_TYPES = {
  TIME_LIMIT: 'time_limit',
  SCHEDULE: 'schedule',
  CONTENT_FILTER: 'content_filter',
} as const;

export type RuleType = keyof typeof RULE_TYPES;

// lib/age-presets.ts
// Reglas sugeridas automáticamente según la edad del perfil

export interface RulePreset {
  rule_type: 'time_limit' | 'schedule' | 'content_filter';
  time_limit_minutes?: number;
  schedule_start?: string; // HH:MM
  schedule_end?: string;
  blocked_categories?: string[];
  label: string;
}

export interface AgePreset {
  ageRange: string;
  label: string;
  emoji: string;
  description: string;
  rules: RulePreset[];
}

export const AGE_PRESETS: Record<string, AgePreset> = {
  '4-7': {
    ageRange: '4-7',
    label: 'Primera infancia',
    emoji: '🧒',
    description: 'Solo contenido educativo, máximo 1 h diaria',
    rules: [
      { rule_type: 'time_limit', time_limit_minutes: 60, label: 'Límite 1 h/día' },
      { rule_type: 'schedule', schedule_start: '09:00', schedule_end: '20:00', label: 'Solo de 9:00 a 20:00' },
      { rule_type: 'content_filter', blocked_categories: ['social_media', 'gaming', 'news', 'shopping', 'streaming'], label: 'Solo contenido educativo' },
    ],
  },
  '8-11': {
    ageRange: '8-11',
    label: 'Niñez',
    emoji: '👦',
    description: 'Máximo 2 h, sin redes sociales',
    rules: [
      { rule_type: 'time_limit', time_limit_minutes: 120, label: 'Límite 2 h/día' },
      { rule_type: 'schedule', schedule_start: '08:00', schedule_end: '21:00', label: 'Solo de 8:00 a 21:00' },
      { rule_type: 'content_filter', blocked_categories: ['social_media', 'adult', 'gambling'], label: 'Sin redes sociales ni contenido adulto' },
    ],
  },
  '12-14': {
    ageRange: '12-14',
    label: 'Preadolescencia',
    emoji: '🧑',
    description: 'Máximo 3 h, sin contenido adulto',
    rules: [
      { rule_type: 'time_limit', time_limit_minutes: 180, label: 'Límite 3 h/día' },
      { rule_type: 'schedule', schedule_start: '07:00', schedule_end: '22:00', label: 'Solo de 7:00 a 22:00' },
      { rule_type: 'content_filter', blocked_categories: ['adult', 'gambling', 'violence'], label: 'Sin contenido adulto' },
    ],
  },
  '15-17': {
    ageRange: '15-17',
    label: 'Adolescencia',
    emoji: '🎒',
    description: 'Máximo 4 h, solo restricción nocturna',
    rules: [
      { rule_type: 'time_limit', time_limit_minutes: 240, label: 'Límite 4 h/día' },
      { rule_type: 'schedule', schedule_start: '07:00', schedule_end: '23:00', label: 'Sin acceso nocturno' },
      { rule_type: 'content_filter', blocked_categories: ['adult', 'gambling'], label: 'Sin contenido adulto ni apuestas' },
    ],
  },
};

export function getPresetForAge(birthYear?: number): AgePreset | null {
  if (!birthYear) return null;
  const age = new Date().getFullYear() - birthYear;
  if (age >= 4 && age <= 7) return AGE_PRESETS['4-7'];
  if (age >= 8 && age <= 11) return AGE_PRESETS['8-11'];
  if (age >= 12 && age <= 14) return AGE_PRESETS['12-14'];
  if (age >= 15 && age <= 17) return AGE_PRESETS['15-17'];
  return null;
}

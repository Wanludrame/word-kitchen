import type { DishType, DishTypeConfig, Seasoning } from './types';

export const DISH_TYPE_CONFIGS: Record<DishType, DishTypeConfig> = {
  poetry: {
    portion: { available: ['auto', 'tiny', 'small'], default: 'auto' },
    heat: { available: ['auto', 'bold', 'balanced', 'gentle'], default: 'auto' },
    flavor: { available: ['auto', 'sweet', 'salty', 'spicy', 'sour', 'bitter'], default: 'auto' },
    perspective: null,
    era: { available: ['auto', 'ancient', 'modern', 'contemporary', 'future', 'any'], default: 'auto' },
  },
  lyrics: {
    portion: { available: ['auto', 'tiny', 'small'], default: 'auto' },
    heat: { available: ['auto', 'bold', 'balanced', 'gentle'], default: 'auto' },
    flavor: { available: ['auto', 'sweet', 'salty', 'spicy', 'sour', 'bitter'], default: 'auto' },
    perspective: null,
    era: { available: ['auto', 'ancient', 'modern', 'contemporary', 'future', 'any'], default: 'auto' },
  },
  'flash-fiction': {
    portion: { available: ['auto', 'tiny', 'small'], default: 'small' },
    heat: { available: ['auto', 'bold', 'balanced', 'gentle'], default: 'auto' },
    flavor: { available: ['auto', 'sweet', 'salty', 'spicy', 'sour', 'bitter'], default: 'auto' },
    perspective: { available: ['auto', 'first', 'third', 'omniscient', 'second'], default: 'auto' },
    era: { available: ['auto', 'ancient', 'modern', 'contemporary', 'future', 'any'], default: 'auto' },
  },
  xiaohongshu: {
    portion: { available: ['auto', 'tiny', 'small', 'medium'], default: 'small' },
    heat: { available: ['auto', 'bold', 'balanced', 'gentle'], default: 'auto' },
    flavor: { available: ['auto', 'sweet', 'salty', 'spicy', 'sour', 'bitter'], default: 'auto' },
    perspective: null,
    era: null,
  },
  podcast: {
    portion: { available: ['auto', 'small', 'medium', 'large'], default: 'medium' },
    heat: { available: ['auto', 'bold', 'balanced', 'gentle'], default: 'auto' },
    flavor: { available: ['auto', 'sweet', 'salty', 'spicy', 'sour', 'bitter'], default: 'auto' },
    perspective: null,
    era: null,
  },
  novel: {
    portion: { available: ['auto', 'medium', 'large', 'xl'], default: 'large' },
    heat: { available: ['auto', 'bold', 'balanced', 'gentle'], default: 'auto' },
    flavor: { available: ['auto', 'sweet', 'salty', 'spicy', 'sour', 'bitter'], default: 'auto' },
    perspective: { available: ['auto', 'first', 'third', 'omniscient', 'second'], default: 'third' },
    era: { available: ['auto', 'ancient', 'modern', 'contemporary', 'future', 'any'], default: 'auto' },
  },
  essay: {
    portion: { available: ['auto', 'small', 'medium', 'large'], default: 'medium' },
    heat: { available: ['auto', 'bold', 'balanced', 'gentle'], default: 'auto' },
    flavor: { available: ['auto', 'sweet', 'salty', 'spicy', 'sour', 'bitter'], default: 'auto' },
    perspective: { available: ['auto', 'first', 'third', 'omniscient', 'second'], default: 'first' },
    era: { available: ['auto', 'ancient', 'modern', 'contemporary', 'future', 'any'], default: 'auto' },
  },
  blog: {
    portion: { available: ['auto', 'medium', 'large', 'xl'], default: 'large' },
    heat: { available: ['auto', 'bold', 'balanced', 'gentle'], default: 'auto' },
    flavor: { available: ['auto', 'sweet', 'salty', 'spicy', 'sour', 'bitter'], default: 'auto' },
    perspective: null,
    era: null,
  },
  review: {
    portion: { available: ['auto', 'small', 'medium', 'large'], default: 'medium' },
    heat: { available: ['auto', 'bold', 'balanced', 'gentle'], default: 'auto' },
    flavor: { available: ['auto', 'sweet', 'salty', 'spicy', 'sour', 'bitter'], default: 'auto' },
    perspective: null,
    era: null,
  },
};

export function getDishConfig(dishType: DishType): DishTypeConfig {
  return DISH_TYPE_CONFIGS[dishType];
}

export function getDefaultSeasoningForDish(dishType: DishType): Seasoning {
  const config = DISH_TYPE_CONFIGS[dishType];
  return {
    portion: config.portion.default,
    heat: config.heat.default,
    flavor: config.flavor.default,
    perspective: config.perspective?.default ?? 'auto',
    era: config.era?.default ?? 'auto',
  };
}

export interface Ingredient {
  id: string;
  title: string;
  content: string;
  source?: string;
  tags: string[];
  createdAt: number;
}

export type PortionValue = 'tiny' | 'small' | 'medium' | 'large' | 'xl' | 'auto';
export type HeatValue = 'bold' | 'balanced' | 'gentle' | 'auto';
export type FlavorValue = 'sweet' | 'salty' | 'spicy' | 'sour' | 'bitter' | 'auto';
export type PerspectiveValue = 'first' | 'third' | 'omniscient' | 'second' | 'auto';
export type EraValue = 'ancient' | 'modern' | 'contemporary' | 'future' | 'any' | 'auto';

export interface Seasoning {
  portion: PortionValue;
  heat: HeatValue;
  flavor: FlavorValue;
  perspective: PerspectiveValue;
  era: EraValue;
}

export interface SeasoningParamConfig<T extends string> {
  available: T[];
  default: T;
}

export interface DishTypeConfig {
  portion: SeasoningParamConfig<PortionValue>;
  heat: SeasoningParamConfig<HeatValue>;
  flavor: SeasoningParamConfig<FlavorValue>;
  perspective: SeasoningParamConfig<PerspectiveValue> | null;
  era: SeasoningParamConfig<EraValue> | null;
}

export type DishType = 'poetry' | 'novel' | 'xiaohongshu' | 'blog' | 'podcast' | 'essay' | 'review' | 'standup' | 'lyrics';

export interface DishTypeInfo {
  id: DishType;
  name: string;
  emoji: string;
  category: string;
  description: string;
}

export interface Chef {
  id: string;
  name: string;
  emoji: string;
  styleTags: string[];
  bestDishes: DishType[];
  description: string;
  stylePrompt: string;
}

export interface Creation {
  id: string;
  dishName: string;
  dishType: DishType;
  chefId: string;
  craftMode?: 'master' | 'custom';
  seasoning: Seasoning;
  content: string;
  ingredientIds: string[];
  createdAt: number;
}

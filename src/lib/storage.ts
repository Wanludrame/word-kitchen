import { Ingredient, Creation } from './types';

const INGREDIENTS_KEY = 'wz-kitchen-ingredients';
const CREATIONS_KEY = 'wz-kitchen-creations';

export function getIngredients(): Ingredient[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(INGREDIENTS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveIngredients(ingredients: Ingredient[]): void {
  localStorage.setItem(INGREDIENTS_KEY, JSON.stringify(ingredients));
}

export function addIngredient(ingredient: Ingredient): Ingredient[] {
  const list = getIngredients();
  list.unshift(ingredient);
  saveIngredients(list);
  return list;
}

export function removeIngredient(id: string): Ingredient[] {
  const list = getIngredients().filter(i => i.id !== id);
  saveIngredients(list);
  return list;
}

export function getCreations(): Creation[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(CREATIONS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveCreation(creation: Creation): Creation[] {
  const list = getCreations();
  list.unshift(creation);
  localStorage.setItem(CREATIONS_KEY, JSON.stringify(list));
  return list;
}

export function removeCreation(id: string): Creation[] {
  const list = getCreations().filter(c => c.id !== id);
  localStorage.setItem(CREATIONS_KEY, JSON.stringify(list));
  return list;
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

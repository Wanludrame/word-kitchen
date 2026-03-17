import type { Seasoning } from './types';

export const PORTION_OPTIONS = [
  { value: 'auto' as const, label: '不限' },
  { value: 'tiny' as const, label: '一小口', desc: '~100字' },
  { value: 'small' as const, label: '小份', desc: '~500字' },
  { value: 'medium' as const, label: '中份', desc: '~1500字' },
  { value: 'large' as const, label: '大份', desc: '~3000字' },
  { value: 'xl' as const, label: '加量', desc: '5000+字' },
];

export const HEAT_OPTIONS = [
  { value: 'auto' as const, label: '不限' },
  { value: 'bold' as const, label: '生猛', desc: '大胆实验' },
  { value: 'balanced' as const, label: '适中', desc: '平衡稳当' },
  { value: 'gentle' as const, label: '文火', desc: '保守稳健' },
];

export const FLAVOR_OPTIONS = [
  { value: 'auto' as const, label: '不限' },
  { value: 'sweet' as const, label: '甜', desc: '温暖治愈' },
  { value: 'salty' as const, label: '咸', desc: '现实犀利' },
  { value: 'spicy' as const, label: '辣', desc: '刺激冲突' },
  { value: 'sour' as const, label: '酸', desc: '讽刺反转' },
  { value: 'bitter' as const, label: '苦', desc: '沉重深刻' },
];

export const PERSPECTIVE_OPTIONS = [
  { value: 'auto' as const, label: '不限' },
  { value: 'first' as const, label: '第一人称' },
  { value: 'third' as const, label: '第三人称' },
  { value: 'omniscient' as const, label: '全知视角' },
  { value: 'second' as const, label: '第二人称' },
];

export const ERA_OPTIONS = [
  { value: 'auto' as const, label: '不限' },
  { value: 'ancient' as const, label: '古代' },
  { value: 'modern' as const, label: '近代' },
  { value: 'contemporary' as const, label: '当代' },
  { value: 'future' as const, label: '未来' },
];

export const DEFAULT_SEASONING: Seasoning = {
  portion: 'medium',
  heat: 'balanced',
  flavor: 'sweet',
  perspective: 'third',
  era: 'auto',
};

export function filterOptions<T extends string>(
  allOptions: { value: T; label: string; desc?: string }[],
  allowed: T[],
): { value: T; label: string; desc?: string }[] {
  return allOptions.filter(opt => allowed.includes(opt.value));
}

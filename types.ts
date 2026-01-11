export type FruitTheme = '🍎' | '🍊' | '🍌' | '🍇' | '🍓';

export interface Song {
  id: string;
  date: string;
  title: string;
  theme: FruitTheme;
  practiceCount: number; // 0 to 10
  memo?: string; // New field for user notes
}

export const THEMES: { label: string; value: FruitTheme }[] = [
  { label: 'Apple', value: '🍎' },
  { label: 'Orange', value: '🍊' },
  { label: 'Banana', value: '🍌' },
  { label: 'Grape', value: '🍇' },
  { label: 'Strawberry', value: '🍓' },
];
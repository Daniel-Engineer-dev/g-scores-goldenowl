export type ThemeId = 'default' | 'argentina' | 'portugal' | 'france';

export interface ThemeMeta {
  id: ThemeId;
  name: string;
  /** Path to the flag/logo SVG (in /public/flags). */
  flagSrc: string;
  description: string;
  /** Representative colours shown as swatches in the picker. */
  swatches: string[];
}

export const THEMES: ThemeMeta[] = [
  {
    id: 'default',
    name: 'Golden Owl',
    flagSrc: '/flags/default.svg',
    description: 'Default theme',
    swatches: ['#141c8c', '#f7d117', '#2f9e8f'],
  },
  {
    id: 'argentina',
    name: 'Argentina',
    flagSrc: '/flags/argentina.svg',
    description: 'Sky blue & white',
    swatches: ['#6cace4', '#ffffff', '#f6b40e'],
  },
  {
    id: 'portugal',
    name: 'Portugal',
    flagSrc: '/flags/portugal.svg',
    description: 'Green & red',
    swatches: ['#006233', '#da020e'],
  },
  {
    id: 'france',
    name: 'France',
    flagSrc: '/flags/france.svg',
    description: 'Blue, white & red',
    swatches: ['#002654', '#ffffff', '#ed2939'],
  },
];

export const DEFAULT_THEME: ThemeId = 'default';

export const THEME_IDS: ThemeId[] = THEMES.map((t) => t.id);

export const THEME_STORAGE_KEY = 'gscores-theme';

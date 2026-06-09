import { Hall, ExhibitionCase } from '../types';

export const HALLS: Hall[] = [
  {
    id: 'hall-A',
    name: 'A厅 · 萌芽时代',
    description: '1980-1990年代，星河科技创业初期的产品',
    color: '#4a3728',
    icon: '🌱'
  },
  {
    id: 'hall-B',
    name: 'B厅 · 黄金岁月',
    description: '1990-2000年代，星河科技最辉煌的时期',
    color: '#c9a85c',
    icon: '⭐'
  },
  {
    id: 'hall-C',
    name: 'C厅 · 探索纪元',
    description: '2000-2010年代，开拓新领域的尝试',
    color: '#1a3c34',
    icon: '🚀'
  },
  {
    id: 'hall-D',
    name: 'D厅 · 特别展区',
    description: '稀有展品、概念产品、原型机',
    color: '#8b3a3a',
    icon: '💎'
  }
];

const casePositions = [
  { x: 8, y: 12 }, { x: 28, y: 12 }, { x: 48, y: 12 }, { x: 68, y: 12 }, { x: 88, y: 12 },
  { x: 8, y: 40 }, { x: 28, y: 40 }, { x: 68, y: 40 }, { x: 88, y: 40 },
  { x: 8, y: 68 }, { x: 28, y: 68 }, { x: 48, y: 68 }, { x: 68, y: 68 }, { x: 88, y: 68 },
];

const lightingOptions: ('warm' | 'cool' | 'spotlight' | 'neon')[] = ['warm', 'cool', 'spotlight', 'neon'];
const backgroundOptions: ('plain' | 'gradient' | 'vintage' | 'futuristic')[] = ['plain', 'gradient', 'vintage', 'futuristic'];

const generateCases = (hallId: string, caseCount: number, startIdx: number): ExhibitionCase[] => {
  return Array.from({ length: caseCount }, (_, i) => {
    const pos = casePositions[i % casePositions.length];
    const globalIdx = startIdx + i;
    return {
      id: `case-${hallId}-${i + 1}`,
      hallId,
      name: `${hallId === 'hall-A' ? 'A' : hallId === 'hall-B' ? 'B' : hallId === 'hall-C' ? 'C' : 'D'}-${String(i + 1).padStart(2, '0')}号展柜`,
      position: {
        x: pos.x + (Math.random() - 0.5) * 3,
        y: pos.y + (Math.random() - 0.5) * 3
      },
      level: globalIdx < 4 ? 3 : globalIdx < 8 ? 2 : 1,
      collectionId: null,
      lighting: lightingOptions[i % lightingOptions.length],
      background: backgroundOptions[Math.floor(i / 4) % backgroundOptions.length],
      unlocked: globalIdx < 10
    };
  });
};

export const EXHIBITION_CASES: ExhibitionCase[] = [
  ...generateCases('hall-A', 5, 0),
  ...generateCases('hall-B', 5, 5),
  ...generateCases('hall-C', 5, 10),
  ...generateCases('hall-D', 5, 15)
];

export const DEFAULT_ROUTE = [
  'case-hall-A-1',
  'case-hall-A-2',
  'case-hall-A-3',
  'case-hall-A-4',
  'case-hall-A-5',
  'case-hall-B-1',
  'case-hall-B-2',
  'case-hall-B-3',
  'case-hall-B-4',
  'case-hall-B-5',
  'case-hall-C-1',
  'case-hall-C-2',
  'case-hall-C-3',
  'case-hall-C-4',
  'case-hall-C-5',
  'case-hall-D-1',
  'case-hall-D-2',
  'case-hall-D-3',
  'case-hall-D-4',
  'case-hall-D-5'
];

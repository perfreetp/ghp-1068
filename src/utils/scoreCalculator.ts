import { CollectionItem, Rarity, ExhibitionPlan, ScoreBreakdown } from '../types';

export const calculateCollectionScore = (item: CollectionItem): number => {
  const authenticityScore = item.isAuthenticated
    ? Math.max(0, 100 - Math.abs((item.estimatedYear || 0) - item.actualYear) * 5)
    : 20;

  const completenessScore = item.isRestored
    ? 100
    : (item.partialDescription.length / item.description.length) * 60 + 20;

  const accessoryScore = item.accessoriesTotal > 0
    ? (item.accessoriesMatched / item.accessoriesTotal) * 100
    : 80;

  const rarityBonus: Record<Rarity, number> = {
    common: 0,
    uncommon: 10,
    rare: 20,
    epic: 35,
    legendary: 50
  };

  const conditionScore = item.condition;

  const baseScore = (
    authenticityScore * 0.25 +
    completenessScore * 0.25 +
    accessoryScore * 0.20 +
    conditionScore * 0.15 +
    rarityBonus[item.rarity] * 0.15
  );

  return Math.min(100, Math.round(baseScore));
};

export const calculateThemeFitScore = (
  items: CollectionItem[],
  plan: ExhibitionPlan
): number => {
  if (items.length === 0) return 0;

  let fitScore = 0;

  items.forEach(item => {
    const year = item.isAuthenticated ? item.actualYear : (item.estimatedYear || plan.startYear);
    if (year >= plan.startYear && year <= plan.endYear) {
      fitScore += 15;
      const mid = (plan.startYear + plan.endYear) / 2;
      const distFromMid = Math.abs(year - mid);
      const range = (plan.endYear - plan.startYear) / 2;
      fitScore += Math.max(0, 10 * (1 - distFromMid / Math.max(1, range)));
    }
  });

  return Math.min(100, Math.round(fitScore / items.length * 5));
};

export const calculateCollectionScoreOverall = (
  items: CollectionItem[],
  plan: ExhibitionPlan,
  reputation: number
): { total: number; breakdown: ScoreBreakdown } => {
  const displayedItems = items.filter(i => i.location === 'exhibition');

  const avgItemScore = displayedItems.length > 0
    ? displayedItems.reduce((sum, i) => sum + i.score, 0) / displayedItems.length
    : 0;

  const themeFitScore = calculateThemeFitScore(displayedItems, plan);

  const routeScore = plan.routeDesignScore || 50;

  const rarityBonus = displayedItems
    .filter(i => i.rarity === 'epic' || i.rarity === 'legendary').length * 20;

  const narrativeScore = Math.min(100, 
    (plan.handbookPublished ? 30 : 0) + 
    (displayedItems.length >= 8 ? 30 : displayedItems.length * 3.75) +
    (plan.themeFitScore || 0) * 0.4
  );

  const authenticity = displayedItems.length > 0
    ? displayedItems.reduce((sum, i) => sum + (i.isAuthenticated ? 80 : 20), 0) / displayedItems.length
    : 0;

  const completeness = displayedItems.length > 0
    ? displayedItems.reduce((sum, i) => sum + (i.isRestored ? 90 : 40), 0) / displayedItems.length
    : 0;

  const rarityScore = displayedItems.length > 0
    ? displayedItems.reduce((sum, i) => {
        const weight: Record<Rarity, number> = {
          common: 20, uncommon: 40, rare: 60, epic: 85, legendary: 100
        };
        return sum + weight[i.rarity];
      }, 0) / displayedItems.length
    : 0;

  const presentation = Math.min(100, 
    (routeScore * 0.4) + 
    (displayedItems.filter(i => i.score >= 70).length * 5) +
    (plan.handbookPublished ? 15 : 0)
  );

  const total = Math.round(
    avgItemScore * 5 +
    themeFitScore * 2 +
    routeScore * 1.5 +
    rarityBonus +
    reputation * 0.5
  );

  return {
    total: Math.max(0, total),
    breakdown: {
      authenticity: Math.round(authenticity),
      completeness: Math.round(completeness),
      rarity: Math.round(rarityScore),
      presentation: Math.round(presentation),
      narrative: Math.round(narrativeScore)
    }
  };
};

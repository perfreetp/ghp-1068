export type Category = 'computer' | 'phone' | 'audio' | 'tv' | 'game' | 'other';
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface Accessory {
  id: string;
  name: string;
  icon: string;
  matched: boolean;
  description: string;
}

export interface CollectionItem {
  id: string;
  name: string;
  category: Category;
  categoryName: string;
  estimatedYear: number | null;
  actualYear: number;
  rarity: Rarity;
  rarityName: string;
  condition: number;
  description: string;
  partialDescription: string;
  isAuthenticated: boolean;
  isRestored: boolean;
  accessories: Accessory[];
  accessoriesMatched: number;
  accessoriesTotal: number;
  image: string;
  color: string;
  score: number;
  location: 'warehouse' | 'exhibition' | 'auction';
  exhibitionCaseId?: string;
  source: string;
  estimatedValue: number;
}

export interface ExhibitionCase {
  id: string;
  hallId: string;
  name: string;
  position: { x: number; y: number };
  level: 1 | 2 | 3;
  collectionId: string | null;
  lighting: 'warm' | 'cool' | 'spotlight' | 'neon';
  background: 'plain' | 'gradient' | 'vintage' | 'futuristic';
  unlocked: boolean;
}

export interface Hall {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
}

export interface VisitorFeedback {
  id: string;
  visitorName: string;
  avatar: string;
  type: 'comment' | 'question';
  content: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  questionCategory?: 'history' | 'tech' | 'price' | 'other';
  options?: string[];
  correctOption?: number;
  answer?: string;
  answered?: boolean;
  satisfaction: number;
  timestamp: number;
  cycle: number;
}

export interface Interview {
  id: string;
  person: string;
  role: string;
  avatar: string;
  content: string;
  unlocked: boolean;
}

export interface ResearchClue {
  id: string;
  title: string;
  content: string;
  unlocked: boolean;
  unlockCondition: string;
  requiredReputation?: number;
  requiredCycle?: number;
  relatedCollectionIds?: string[];
  interviews: Interview[];
  connections: string[];
  icon: string;
}

export interface SpecialTask {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'collection' | 'exhibition' | 'research' | 'reputation';
  progress: number;
  target: number;
  completed: boolean;
  claimed: boolean;
  reward: {
    type: 'budget' | 'reputation' | 'collection' | 'clue';
    value: number | string;
    label: string;
  };
}

export interface CompetitorSpec {
  label: string;
  value: string;
  advantage: boolean;
}

export interface CompetitorProduct {
  id: string;
  name: string;
  company: string;
  year: number;
  category: Category;
  image: string;
  specs: CompetitorSpec[];
  marketShare: number;
  price: number;
}

export interface AuctionOpponent {
  id: string;
  name: string;
  avatar: string;
  style: 'aggressive' | 'conservative' | 'random';
  budget: number;
  maxBidMultiplier: number;
}

export interface AuctionItem {
  id: string;
  collection: CollectionItem;
  startPrice: number;
  currentPrice: number;
  myBid: number;
  highestBidder: string;
  isLeading: boolean;
  timeLeft: number;
  status: 'upcoming' | 'active' | 'ended' | 'won' | 'lost' | 'passed';
  opponents: AuctionOpponent[];
  bidHistory: { bidder: string; amount: number; time: number }[];
}

export type AudienceType = 'general' | 'enthusiast' | 'expert' | 'students';

export interface ExhibitionPlan {
  id: string;
  theme: string;
  themeDescription: string;
  startYear: number;
  endYear: number;
  targetAudience: AudienceType;
  audienceName: string;
  handbookTitle: string;
  handbookCover: string;
  handbookPublished: boolean;
  brochureCount: number;
  handbookPrintCost: number;
  handbookPrinted: number;
  routeDesignScore: number;
  themeFitScore: number;
  overallScore: number;
  route: string[];
}

export interface TourRoute {
  id: string;
  caseOrder: string[];
  startTime: string;
  estimatedDuration: number;
  highlights: string[];
  score: number;
}

export type EventType = 'hidden' | 'random' | 'milestone' | 'achievement';

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  type: EventType;
  icon: string;
  triggered: boolean;
  triggerCycle?: number;
  condition: {
    minScore?: number;
    minReputation?: number;
    requiredCollections?: string[];
    requiredClues?: string[];
    randomChance?: number;
  };
  reward?: {
    type: 'budget' | 'reputation' | 'collection' | 'clue';
    value: number | string;
    label: string;
  };
  cycle: number;
}

export interface ScoreBreakdown {
  authenticity: number;
  completeness: number;
  rarity: number;
  presentation: number;
  narrative: number;
}

export interface FinancialReport {
  cycle: number;
  income: {
    ticketSales: number;
    merchandise: number;
    donations: number;
    sponsorship: number;
  };
  expenses: {
    auctionPurchases: number;
    restoration: number;
    marketing: number;
    maintenance: number;
  };
  visitorStats: {
    total: number;
    byAudience: Record<AudienceType, number>;
    satisfaction: number;
    averageTicketPrice?: number;
    handbookBonus?: number;
    brochureDistributed?: number;
  };
  scoreBreakdown: ScoreBreakdown;
  prevCollectionScore: number;
  newCollectionScore: number;
  prevReputation: number;
  newReputation: number;
  cycleMetrics: {
    budgetSnapshot: number;
    reputationSnapshot: number;
    scoreSnapshot: number;
    visitorSnapshot: number;
    incomeTotal: number;
    expenseTotal: number;
  };
}

export type ModuleType = 'hall' | 'warehouse' | 'visitors' | 'research' | 'auction' | 'planning' | 'settlement';

export type GamePhase = 'planning' | 'exhibition' | 'settlement';

export interface GameState {
  cycle: number;
  phase: GamePhase;
  budget: number;
  reputation: number;
  collectionScore: number;
  totalVisitors: number;
  currentModule: ModuleType;
  selectedCollectionId: string | null;
  selectedCaseId: string | null;
  isDragging: boolean;
  draggedCollectionId: string | null;
  notification: { message: string; type: 'success' | 'error' | 'info' | 'warning' } | null;
  showEventModal: boolean;
  currentEvent: GameEvent | null;
  showReportModal: boolean;
  lastReport: FinancialReport | null;
}

export interface GameActions {
  setCurrentModule: (module: ModuleType) => void;
  setSelectedCollection: (id: string | null) => void;
  setSelectedCase: (id: string | null) => void;
  setDragging: (isDragging: boolean, collectionId?: string | null) => void;
  setNotification: (notification: { message: string; type: 'success' | 'error' | 'info' | 'warning' } | null) => void;
  showEvent: (event: GameEvent) => void;
  closeEventModal: () => void;
  showReport: (report: FinancialReport) => void;
  closeReportModal: () => void;
  addBudget: (amount: number) => void;
  deductBudget: (amount: number) => boolean;
  addReputation: (amount: number) => void;
  setCollectionScore: (score: number) => void;
  addVisitors: (count: number) => void;
}

export type GameStore = GameState & GameActions;

export const RARITY_COLORS: Record<Rarity, string> = {
  common: '#9ca3af',
  uncommon: '#22c55e',
  rare: '#3b82f6',
  epic: '#a855f7',
  legendary: '#f59e0b'
};

export const RARITY_NAMES: Record<Rarity, string> = {
  common: '普通',
  uncommon: '优秀',
  rare: '稀有',
  epic: '史诗',
  legendary: '传说'
};

export const CATEGORY_NAMES: Record<Category, string> = {
  computer: '个人电脑',
  phone: '移动电话',
  audio: '音频设备',
  tv: '电视机',
  game: '游戏机',
  other: '其他设备'
};

export const CATEGORY_ICONS: Record<Category, string> = {
  computer: '💻',
  phone: '📱',
  audio: '🎵',
  tv: '📺',
  game: '🎮',
  other: '🔌'
};

export const AUDIENCE_NAMES: Record<AudienceType, string> = {
  general: '普通大众',
  enthusiast: '科技爱好者',
  expert: '专业人士',
  students: '学生群体'
};

export const LIGHTING_NAMES: Record<string, string> = {
  warm: '暖黄光',
  cool: '冷白光',
  spotlight: '聚光灯',
  neon: '霓虹光'
};

export const BACKGROUND_NAMES: Record<string, string> = {
  plain: '纯色背景',
  gradient: '渐变背景',
  vintage: '复古纹理',
  futuristic: '未来科技'
};

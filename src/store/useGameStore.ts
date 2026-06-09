import { create } from 'zustand';
import {
  CollectionItem,
  ExhibitionCase,
  VisitorFeedback,
  ResearchClue,
  SpecialTask,
  AuctionItem,
  ExhibitionPlan,
  GameEvent,
  FinancialReport,
  ModuleType,
  GamePhase,
  AudienceType,
  AUDIENCE_NAMES
} from '../types';
import {
  INITIAL_COLLECTIONS,
  AUCTION_POOL
} from '../data/collections';
import { EXHIBITION_CASES, DEFAULT_ROUTE } from '../data/halls';
import { INITIAL_VISITOR_FEEDBACK, generateVisitorFeedback } from '../data/visitors';
import { INITIAL_CLUES } from '../data/clues';
import { INITIAL_TASKS } from '../data/tasks';
import { GAME_EVENTS } from '../data/events';
import { AUCTION_OPPONENTS } from '../data/auctions';
import {
  calculateCollectionScore,
  calculateCollectionScoreOverall,
  calculateThemeFitScore
} from '../utils/scoreCalculator';
import { processTriggeredEvents, applyEventReward } from '../utils/eventTrigger';

interface GameStoreState {
  cycle: number;
  phase: GamePhase;
  budget: number;
  reputation: number;
  collectionScore: number;
  totalVisitors: number;
  income: number;
  expenses: number;

  collections: CollectionItem[];
  cases: ExhibitionCase[];
  feedbacks: VisitorFeedback[];
  clues: ResearchClue[];
  tasks: SpecialTask[];
  auctionItems: AuctionItem[];
  events: GameEvent[];
  reports: FinancialReport[];
  plan: ExhibitionPlan;

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

  taskStats: {
    authCount: number;
    restoreCount: number;
    deployCount: number;
    answerCount: number;
    clueUnlocked: number;
    epicCount: number;
    fullAccessory: number;
    totalAccessoryMatched: number;
    exhibit90sCount: number;
  };
}

interface GameStoreActions {
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
  addVisitors: (count: number) => void;

  authenticateCollection: (id: string, estimatedYear: number) => void;
  restoreCollection: (id: string) => void;
  matchAccessory: (collectionId: string, accessoryId: string) => void;

  deployToCase: (collectionId: string, caseId: string) => void;
  removeFromCase: (caseId: string) => void;
  updateCaseLighting: (caseId: string, lighting: ExhibitionCase['lighting']) => void;
  updateCaseBackground: (caseId: string, background: ExhibitionCase['background']) => void;

  updatePlan: (updates: Partial<ExhibitionPlan>) => void;
  updatePlanRoute: (route: string[]) => void;
  publishHandbook: () => void;

  answerQuestion: (feedbackId: string, optionIndex: number) => void;

  placeBid: (auctionId: string, bidAmount: number) => void;
  processAuctionRound: () => void;

  updateTaskProgress: () => void;
  claimTaskReward: (taskId: string) => void;

  unlockClue: (clueId: string) => void;
  unlockInterview: (clueId: string, interviewId: string) => void;

  settleCycle: () => void;
  advanceCycle: () => void;
}

const INITIAL_PLAN: ExhibitionPlan = {
  id: 'plan-1',
  theme: '星河四十年：从车库到世界',
  themeDescription: '回顾星河科技自1982年成立以来的发展历程，展示其从创业初期到行业巨头的经典产品。',
  startYear: 1980,
  endYear: 2010,
  targetAudience: 'general',
  audienceName: AUDIENCE_NAMES['general'],
  handbookTitle: '星河四十年典藏册',
  handbookCover: '🎨',
  handbookPublished: false,
  brochureCount: 500,
  routeDesignScore: 65,
  themeFitScore: 0,
  overallScore: 0,
  route: DEFAULT_ROUTE
};

const createInitialAuctionItems = (): AuctionItem[] => {
  return AUCTION_POOL.slice(0, 3).map((col, idx) => ({
    id: `auction-${idx + 1}`,
    collection: { ...col, score: calculateCollectionScore(col) },
    startPrice: Math.floor(col.estimatedValue * 0.6),
    currentPrice: Math.floor(col.estimatedValue * 0.6),
    myBid: 0,
    highestBidder: '——',
    isLeading: false,
    timeLeft: 3,
    status: 'active',
    opponents: AUCTION_OPPONENTS.slice(0, 3),
    bidHistory: []
  }));
};

export const useGameStore = create<GameStoreState & GameStoreActions>((set, get) => ({
  cycle: 1,
  phase: 'planning',
  budget: 100000,
  reputation: 20,
  collectionScore: 0,
  totalVisitors: 0,
  income: 0,
  expenses: 0,

  collections: INITIAL_COLLECTIONS.map(c => ({
    ...c,
    score: calculateCollectionScore(c)
  })),
  cases: EXHIBITION_CASES,
  feedbacks: INITIAL_VISITOR_FEEDBACK,
  clues: INITIAL_CLUES,
  tasks: INITIAL_TASKS,
  auctionItems: createInitialAuctionItems(),
  events: GAME_EVENTS,
  reports: [],
  plan: INITIAL_PLAN,

  currentModule: 'warehouse',
  selectedCollectionId: null,
  selectedCaseId: null,
  isDragging: false,
  draggedCollectionId: null,
  notification: null,
  showEventModal: false,
  currentEvent: null,
  showReportModal: false,
  lastReport: null,

  taskStats: {
    authCount: 0,
    restoreCount: 0,
    deployCount: 0,
    answerCount: 0,
    clueUnlocked: 2,
    epicCount: 0,
    fullAccessory: 0,
    totalAccessoryMatched: 0,
    exhibit90sCount: 0
  },

  setCurrentModule: (module) => set({ currentModule: module }),
  setSelectedCollection: (id) => set({ selectedCollectionId: id }),
  setSelectedCase: (id) => set({ selectedCaseId: id }),
  setDragging: (isDragging, collectionId = null) =>
    set({ isDragging, draggedCollectionId: collectionId }),
  setNotification: (notification) => {
    set({ notification });
    if (notification) {
      setTimeout(() => set({ notification: null }), 3500);
    }
  },
  showEvent: (event) => set({ showEventModal: true, currentEvent: event }),
  closeEventModal: () => set({ showEventModal: false, currentEvent: null }),
  showReport: (report) => set({ showReportModal: true, lastReport: report }),
  closeReportModal: () => set({ showReportModal: false }),

  addBudget: (amount) => set((state) => ({
    budget: state.budget + amount,
    income: amount > 0 ? state.income + amount : state.income
  })),
  deductBudget: (amount) => {
    const state = get();
    if (state.budget < amount) {
      state.setNotification({ message: '预算不足！', type: 'error' });
      return false;
    }
    set({
      budget: state.budget - amount,
      expenses: state.expenses + amount
    });
    return true;
  },
  addReputation: (amount) => set((state) => ({
    reputation: Math.max(0, Math.min(100, state.reputation + amount))
  })),
  addVisitors: (count) => set((state) => ({
    totalVisitors: state.totalVisitors + count
  })),

  authenticateCollection: (id, estimatedYear) => {
    const state = get();
    const cost = 800;
    if (!state.deductBudget(cost)) return;

    const collections = state.collections.map(c => {
      if (c.id === id) {
        const updated = {
          ...c,
          estimatedYear,
          isAuthenticated: true
        };
        return { ...updated, score: calculateCollectionScore(updated) };
      }
      return c;
    });

    const item = collections.find(c => c.id === id)!;
    const diff = Math.abs(estimatedYear - item.actualYear);
    let message = '';
    if (diff === 0) {
      message = `鉴定完美！${item.name}的年代完全正确！`;
    } else if (diff <= 2) {
      message = `鉴定通过！${item.name}的真实年代是${item.actualYear}年（误差${diff}年）`;
    } else {
      message = `鉴定完成！${item.name}的真实年代是${item.actualYear}年（误差${diff}年，需更精确）`;
    }

    const stats = { ...state.taskStats, authCount: state.taskStats.authCount + 1 };

    set({
      collections,
      taskStats: stats
    });
    state.setNotification({ message, type: diff <= 2 ? 'success' : 'info' });
    state.updateTaskProgress();
  },

  restoreCollection: (id) => {
    const state = get();
    const cost = 1500;
    if (!state.deductBudget(cost)) return;

    const collections = state.collections.map(c => {
      if (c.id === id) {
        const updated = { ...c, isRestored: true };
        return { ...updated, score: calculateCollectionScore(updated) };
      }
      return c;
    });

    const item = collections.find(c => c.id === id)!;
    const stats = { ...state.taskStats, restoreCount: state.taskStats.restoreCount + 1 };

    set({
      collections,
      taskStats: stats
    });
    state.setNotification({ message: `修复完成！${item.name}的说明已完整恢复。`, type: 'success' });
    state.updateTaskProgress();
  },

  matchAccessory: (collectionId, accessoryId) => {
    const state = get();
    const cost = 300;
    if (!state.deductBudget(cost)) return;

    let matchedFull = false;
    const collections = state.collections.map(c => {
      if (c.id === collectionId) {
        const accessories = c.accessories.map(a =>
          a.id === accessoryId ? { ...a, matched: true } : a
        );
        const matchedCount = accessories.filter(a => a.matched).length;
        matchedFull = matchedCount === accessories.length && accessories.length > 0;
        const updated = {
          ...c,
          accessories,
          accessoriesMatched: matchedCount
        };
        return { ...updated, score: calculateCollectionScore(updated) };
      }
      return c;
    });

    const stats = {
      ...state.taskStats,
      totalAccessoryMatched: state.taskStats.totalAccessoryMatched + 1,
      fullAccessory: matchedFull ? state.taskStats.fullAccessory + 1 : state.taskStats.fullAccessory
    };

    set({
      collections,
      taskStats: stats
    });
    const message = matchedFull
      ? `太棒了！全部配件已匹配完成！`
      : `配件匹配成功！`;
    state.setNotification({ message, type: 'success' });
    state.updateTaskProgress();
  },

  deployToCase: (collectionId, caseId) => {
    const state = get();
    const item = state.collections.find(c => c.id === collectionId);
    const exhibitCase = state.cases.find(c => c.id === caseId);

    if (!item || !exhibitCase) return;
    if (!exhibitCase.unlocked) {
      state.setNotification({ message: '该展柜尚未解锁！', type: 'error' });
      return;
    }

    const prevCaseId = item.exhibitionCaseId;
    let cases = state.cases.map(c => ({ ...c }));
    if (prevCaseId) {
      const prevCase = cases.find(c => c.id === prevCaseId);
      if (prevCase) prevCase.collectionId = null;
    }
    if (exhibitCase.collectionId) {
      const prevItem = state.collections.find(c => c.id === exhibitCase.collectionId);
      if (prevItem) {
        prevItem.location = 'warehouse';
        prevItem.exhibitionCaseId = undefined;
      }
    }
    const targetCase = cases.find(c => c.id === caseId)!;
    targetCase.collectionId = collectionId;

    const collections = state.collections.map(c => {
      if (c.id === collectionId) {
        return { ...c, location: 'exhibition' as const, exhibitionCaseId: caseId };
      }
      if (c.id === exhibitCase.collectionId) {
        return { ...c, location: 'warehouse' as const, exhibitionCaseId: undefined };
      }
      return c;
    });

    const deployCount = collections.filter(c => c.location === 'exhibition').length;
    const exhibit90sCount = collections.filter(c =>
      c.location === 'exhibition' && c.actualYear >= 1990 && c.actualYear < 2000
    ).length;
    const epicCount = collections.filter(c =>
      (c.rarity === 'epic' || c.rarity === 'legendary') && c.location !== 'auction'
    ).length;

    const plan = { ...state.plan };
    plan.themeFitScore = calculateThemeFitScore(collections, plan);
    const { total: overallScore } = calculateCollectionScoreOverall(collections, plan, state.reputation);
    plan.overallScore = overallScore;

    set({
      collections,
      cases,
      plan,
      collectionScore: overallScore,
      taskStats: {
        ...state.taskStats,
        deployCount,
        exhibit90sCount,
        epicCount
      },
      selectedCollectionId: null,
      selectedCaseId: null,
      isDragging: false,
      draggedCollectionId: null
    });
    get().setNotification({
      message: `${item.name}已成功布置到${exhibitCase.name}`,
      type: 'success'
    });
    get().updateTaskProgress();
  },

  removeFromCase: (caseId) => {
    const state = get();
    const exhibitCase = state.cases.find(c => c.id === caseId);
    if (!exhibitCase || !exhibitCase.collectionId) return;

    const cases = state.cases.map(c =>
      c.id === caseId ? { ...c, collectionId: null } : c
    );
    const collections = state.collections.map(c =>
      c.id === exhibitCase.collectionId
        ? { ...c, location: 'warehouse' as const, exhibitionCaseId: undefined }
        : c
    );

    const deployCount = collections.filter(c => c.location === 'exhibition').length;
    const exhibit90sCount = collections.filter(c =>
      c.location === 'exhibition' && c.actualYear >= 1990 && c.actualYear < 2000
    ).length;

    set({ collections, cases, taskStats: { ...state.taskStats, deployCount, exhibit90sCount } });
    get().updateTaskProgress();
  },

  updateCaseLighting: (caseId, lighting) => {
    set(state => ({
      cases: state.cases.map(c =>
        c.id === caseId ? { ...c, lighting } : c
      )
    }));
  },

  updateCaseBackground: (caseId, background) => {
    set(state => ({
      cases: state.cases.map(c =>
        c.id === caseId ? { ...c, background } : c
      )
    }));
  },

  updatePlan: (updates) => {
    set((state) => {
      const plan = { ...state.plan, ...updates };
      if (updates.targetAudience) {
        plan.audienceName = AUDIENCE_NAMES[updates.targetAudience as AudienceType];
      }
      plan.themeFitScore = calculateThemeFitScore(state.collections, plan);
      const { total } = calculateCollectionScoreOverall(state.collections, plan, state.reputation);
      plan.overallScore = total;
      return { plan, collectionScore: total };
    });
  },

  updatePlanRoute: (route) => {
    set((state) => {
      const routeScore = Math.min(100, 40 + route.length * 4);
      const plan = { ...state.plan, route, routeDesignScore: routeScore };
      const { total } = calculateCollectionScoreOverall(state.collections, plan, state.reputation);
      plan.overallScore = total;
      return { plan, collectionScore: total };
    });
  },

  publishHandbook: () => {
    const state = get();
    const cost = 3000;
    if (!state.deductBudget(cost)) return;
    const plan = { ...state.plan, handbookPublished: true };
    const { total } = calculateCollectionScoreOverall(state.collections, plan, state.reputation);
    plan.overallScore = total;
    set({ plan, collectionScore: total });
    get().setNotification({ message: '展览手册已成功发布！口碑提升+8', type: 'success' });
    get().addReputation(8);
  },

  answerQuestion: (feedbackId, optionIndex) => {
    const state = get();
    const feedback = state.feedbacks.find(f => f.id === feedbackId);
    if (!feedback || feedback.answered) return;

    const isCorrect = optionIndex === feedback.correctOption;
    const feedbacks = state.feedbacks.map(f => {
      if (f.id === feedbackId) {
        return {
          ...f,
          answered: true,
          answer: f.options?.[optionIndex],
          satisfaction: isCorrect ? Math.min(100, f.satisfaction + 35) : Math.max(0, f.satisfaction - 10),
          sentiment: isCorrect ? 'positive' as const : 'neutral' as const
        };
      }
      return f;
    });

    const answerCount = state.taskStats.answerCount + 1;
    const taskStats = { ...state.taskStats, answerCount };

    if (isCorrect) {
      get().addReputation(2);
    }

    set({ feedbacks, taskStats });
    get().setNotification({
      message: isCorrect ? '回答正确！访客满意度提升！' : '回答有误...没关系，继续加油！',
      type: isCorrect ? 'success' : 'warning'
    });
    get().updateTaskProgress();
  },

  placeBid: (auctionId, bidAmount) => {
    const state = get();
    const auction = state.auctionItems.find(a => a.id === auctionId);
    if (!auction || auction.status !== 'active') return;

    if (bidAmount <= auction.currentPrice) {
      state.setNotification({ message: '出价必须高于当前价格！', type: 'error' });
      return;
    }

    if (state.budget < bidAmount) {
      state.setNotification({ message: '预算不足！', type: 'error' });
      return;
    }

    const auctionItems = state.auctionItems.map(a => {
      if (a.id === auctionId) {
        return {
          ...a,
          currentPrice: bidAmount,
          myBid: bidAmount,
          highestBidder: '你',
          isLeading: true,
          bidHistory: [...a.bidHistory, { bidder: '你', amount: bidAmount, time: Date.now() }]
        };
      }
      return a;
    });

    set({ auctionItems });
    state.setNotification({ message: `出价成功！当前最高价：¥${bidAmount.toLocaleString()}`, type: 'success' });
  },

  processAuctionRound: () => {
    const state = get();
    let itemsWon: CollectionItem[] = [];
    let totalCost = 0;

    const auctionItems = state.auctionItems.map(auction => {
      if (auction.status !== 'active') return auction;

      let currentPrice = auction.currentPrice;
      let highestBidder = auction.highestBidder;
      let isLeading = auction.isLeading;
      let myBid = auction.myBid;
      const bidHistory = [...auction.bidHistory];

      auction.opponents.forEach(opponent => {
        if (opponent.budget <= currentPrice) return;
        const maxBid = auction.collection.estimatedValue * opponent.maxBidMultiplier;
        if (currentPrice >= maxBid) return;

        const shouldBid = Math.random() < 0.6;
        if (!shouldBid) return;

        const incrementPct = opponent.style === 'aggressive' ? 0.08 + Math.random() * 0.07
          : opponent.style === 'conservative' ? 0.03 + Math.random() * 0.04
          : 0.05 + Math.random() * 0.08;
        let increment = Math.max(Math.floor(auction.collection.estimatedValue * incrementPct), 500);
        let newBid = currentPrice + increment;
        newBid = Math.min(newBid, Math.floor(maxBid));

        if (newBid > currentPrice && opponent.budget >= newBid) {
          if (myBid > newBid) {
            newBid = myBid + increment;
            if (newBid > maxBid) return;
          }
          currentPrice = newBid;
          highestBidder = opponent.name;
          isLeading = false;
          bidHistory.push({ bidder: opponent.name, amount: newBid, time: Date.now() });
        }
      });

      const newTimeLeft = auction.timeLeft - 1;

      if (newTimeLeft <= 0) {
        if (isLeading) {
          itemsWon.push({ ...auction.collection, location: 'warehouse' as const });
          totalCost += currentPrice;
          return {
            ...auction,
            currentPrice,
            highestBidder,
            isLeading,
            bidHistory,
            timeLeft: 0,
            status: 'won' as const
          };
        } else {
          return {
            ...auction,
            currentPrice,
            highestBidder,
            isLeading,
            bidHistory,
            timeLeft: 0,
            status: 'lost' as const
          };
        }
      }

      return {
        ...auction,
        currentPrice,
        highestBidder,
        isLeading,
        myBid: isLeading ? myBid : 0,
        bidHistory,
        timeLeft: newTimeLeft
      };
    });

    let collections = state.collections;
    let newBudget = state.budget;

    if (itemsWon.length > 0) {
      if (newBudget >= totalCost) {
        newBudget -= totalCost;
        collections = [...collections, ...itemsWon.map((item, idx) => ({
          ...item,
          id: `${item.id}-won-${Date.now()}-${idx}`,
          score: calculateCollectionScore(item)
        }))];
        state.setNotification({
          message: `恭喜！您成功拍得${itemsWon.length}件藏品！`,
          type: 'success'
        });
      }
    }

    const newAuctionItems = auctionItems.map(item => {
      if (item.status === 'won' || item.status === 'lost') {
        const nextCol = AUCTION_POOL[Math.floor(Math.random() * AUCTION_POOL.length)];
        return {
          id: `auction-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          collection: { ...nextCol, score: calculateCollectionScore(nextCol) },
          startPrice: Math.floor(nextCol.estimatedValue * 0.6),
          currentPrice: Math.floor(nextCol.estimatedValue * 0.6),
          myBid: 0,
          highestBidder: '——',
          isLeading: false,
          timeLeft: 3,
          status: 'active' as const,
          opponents: AUCTION_OPPONENTS
            .sort(() => Math.random() - 0.5)
            .slice(0, 2 + Math.floor(Math.random() * 2)),
          bidHistory: []
        };
      }
      return item;
    });

    set({
      auctionItems: newAuctionItems,
      collections,
      budget: newBudget,
      expenses: state.expenses + (state.budget - newBudget)
    });
  },

  updateTaskProgress: () => {
    set((state) => {
      const tasks = state.tasks.map(task => {
        let progress = task.progress;
        switch (task.id) {
          case 'task-001': progress = Math.min(state.taskStats.authCount, task.target); break;
          case 'task-002': progress = Math.min(state.taskStats.restoreCount, task.target); break;
          case 'task-003': progress = Math.min(state.taskStats.deployCount, task.target); break;
          case 'task-004': progress = Math.min(state.taskStats.answerCount, task.target); break;
          case 'task-005': progress = Math.min(state.taskStats.clueUnlocked, task.target); break;
          case 'task-006': progress = Math.min(state.taskStats.epicCount, task.target); break;
          case 'task-007': progress = Math.min(state.taskStats.fullAccessory, task.target); break;
          case 'task-008': progress = Math.min(state.collectionScore, task.target); break;
          case 'task-009': progress = Math.min(state.taskStats.totalAccessoryMatched, task.target); break;
          case 'task-010': progress = Math.min(state.taskStats.exhibit90sCount, task.target); break;
        }
        return {
          ...task,
          progress,
          completed: progress >= task.target
        };
      });
      return { tasks };
    });
  },

  claimTaskReward: (taskId) => {
    const state = get();
    const task = state.tasks.find(t => t.id === taskId);
    if (!task || !task.completed || task.claimed) return;

    const tasks = state.tasks.map(t =>
      t.id === taskId ? { ...t, claimed: true } : t
    );

    switch (task.reward.type) {
      case 'budget':
        state.addBudget(task.reward.value as number);
        break;
      case 'reputation':
        state.addReputation(task.reward.value as number);
        break;
    }

    set({ tasks });
    state.setNotification({
      message: `任务完成！${task.reward.label}`,
      type: 'success'
    });
  },

  unlockClue: (clueId) => {
    const state = get();
    const clues = state.clues.map(c => {
      if (c.id === clueId && !c.unlocked) {
        return {
          ...c,
          unlocked: true,
          interviews: c.interviews.map(i => ({ ...i, unlocked: true }))
        };
      }
      return c;
    });

    const clueUnlocked = clues.filter(c => c.unlocked).length;

    set({
      clues,
      taskStats: { ...state.taskStats, clueUnlocked }
    });
    state.setNotification({ message: `线索已解锁！`, type: 'success' });
    state.updateTaskProgress();
  },

  unlockInterview: (clueId, interviewId) => {
    set((state) => ({
      clues: state.clues.map(c => {
        if (c.id === clueId) {
          return {
            ...c,
            interviews: c.interviews.map(i =>
              i.id === interviewId ? { ...i, unlocked: true } : i
            )
          };
        }
        return c;
      })
    }));
  },

  settleCycle: () => {
    const state = get();

    state.processAuctionRound();

    const visitorsBase = Math.floor(state.collectionScore * 2.5);
    const reputationBonus = Math.floor(state.reputation * 15);
    const audienceMultiplier = state.plan.targetAudience === 'general' ? 1.5
      : state.plan.targetAudience === 'enthusiast' ? 1.2
      : state.plan.targetAudience === 'students' ? 1.8
      : 0.8;
    const totalVisitorsThisCycle = Math.floor((visitorsBase + reputationBonus) * audienceMultiplier);

    const ticketPrice = state.plan.targetAudience === 'expert' ? 120
      : state.plan.targetAudience === 'enthusiast' ? 80
      : state.plan.targetAudience === 'students' ? 30
      : 50;
    const ticketSales = totalVisitorsThisCycle * ticketPrice;

    const merchandise = Math.floor(totalVisitorsThisCycle * 15 * (state.plan.handbookPublished ? 1.5 : 1));
    const donations = Math.floor(state.reputation * 80 + Math.random() * 3000);
    const sponsorship = state.collectionScore >= 400 ? Math.floor(state.collectionScore * 20) : 0;

    const restoration = 0;
    const marketing = state.plan.handbookPublished ? 2000 : 0;
    const maintenance = Math.floor(totalVisitorsThisCycle * 3);
    const auctionPurchases = 0;

    const positive = state.feedbacks.filter(f => f.sentiment === 'positive').length;
    const total = state.feedbacks.length || 1;
    const satisfaction = Math.round(50 + (positive / total) * 40 + state.reputation * 0.1);

    const byAudience: Record<AudienceType, number> = {
      general: Math.floor(totalVisitorsThisCycle * 0.5),
      enthusiast: Math.floor(totalVisitorsThisCycle * 0.2),
      expert: Math.floor(totalVisitorsThisCycle * 0.1),
      students: Math.floor(totalVisitorsThisCycle * 0.2)
    };

    const { breakdown } = calculateCollectionScoreOverall(
      state.collections,
      state.plan,
      state.reputation
    );

    const prevScore = state.collectionScore;
    const prevRep = state.reputation;

    set({
      phase: 'settlement'
    });

    const newBudget = state.budget + ticketSales + merchandise + donations + sponsorship - marketing - maintenance;

    const report: FinancialReport = {
      cycle: state.cycle,
      income: {
        ticketSales,
        merchandise,
        donations,
        sponsorship
      },
      expenses: {
        auctionPurchases,
        restoration,
        marketing,
        maintenance
      },
      visitorStats: {
        total: totalVisitorsThisCycle,
        byAudience,
        satisfaction: Math.min(100, satisfaction)
      },
      scoreBreakdown: breakdown,
      prevCollectionScore: prevScore,
      newCollectionScore: state.collectionScore,
      prevReputation: prevRep,
      newReputation: state.reputation
    };

    const { updated: updatedEvents, triggered } = processTriggeredEvents(
      state.events,
      { collectionScore: state.collectionScore, reputation: state.reputation },
      state.collections,
      state.clues,
      state.cycle
    );

    let finalBudget = newBudget;
    let finalReputation = state.reputation;
    triggered.forEach(event => {
      if (event.reward) {
        if (event.reward.type === 'budget') {
          finalBudget += event.reward.value as number;
        } else if (event.reward.type === 'reputation') {
          finalReputation = Math.max(0, Math.min(100, finalReputation + (event.reward.value as number)));
        }
      }
    });

    const repChange = Math.max(-5, Math.min(10, Math.floor((satisfaction - 60) / 4)));
    finalReputation = Math.max(0, Math.min(100, finalReputation + repChange));

    const newFeedbacks = generateVisitorFeedback(state.cycle + 1,
      6 + Math.floor(Math.random() * 6));

    set({
      budget: finalBudget,
      reputation: finalReputation,
      totalVisitors: state.totalVisitors + totalVisitorsThisCycle,
      events: updatedEvents,
      reports: [...state.reports, report],
      feedbacks: [...newFeedbacks, ...state.feedbacks].slice(0, 50),
      income: state.income + ticketSales + merchandise + donations + sponsorship,
      expenses: state.expenses + marketing + maintenance
    });

    if (triggered.length > 0) {
      setTimeout(() => {
        get().showEvent(triggered[0]);
      }, 500);
    }

    get().showReport(report);
  },

  advanceCycle: () => {
    const state = get();
    set({
      cycle: state.cycle + 1,
      phase: 'planning',
      income: 0,
      expenses: 0
    });
    get().setNotification({ message: `进入第 ${state.cycle + 1} 周期！`, type: 'info' });
  }
}));

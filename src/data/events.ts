import { GameEvent } from '../types';

export const GAME_EVENTS: GameEvent[] = [
  {
    id: 'evt-001',
    title: '星河校友来访',
    description: '星河科技的老员工团体慕名而来参观，他们对每一件展品都充满感情。参观结束后留下了一笔慷慨的捐赠。',
    type: 'random',
    icon: '👥',
    triggered: false,
    condition: {
      minScore: 200,
      randomChance: 0.35
    },
    reward: {
      type: 'budget',
      value: 20000,
      label: '+¥20,000 捐赠收入'
    },
    cycle: 0
  },
  {
    id: 'evt-002',
    title: '神秘包裹',
    description: '一个匿名包裹寄到了博物馆，打开后发现是星河-0原型机的原始主板！附带的纸条上写着："让它回家。"',
    type: 'hidden',
    icon: '📦',
    triggered: false,
    condition: {
      requiredCollections: ['col-xh-001'],
      requiredClues: ['clue-001'],
      randomChance: 0.5
    },
    reward: {
      type: 'collection',
      value: '神秘配件',
      label: '获得稀有配件'
    },
    cycle: 0
  },
  {
    id: 'evt-003',
    title: '馆藏里程碑',
    description: '馆藏评分突破300分！当地报纸头版报道了你的博物馆，越来越多的游客开始关注。',
    type: 'milestone',
    icon: '🏆',
    triggered: false,
    condition: {
      minScore: 300
    },
    reward: {
      type: 'reputation',
      value: 20,
      label: '+20 口碑指数'
    },
    cycle: 0
  },
  {
    id: 'evt-004',
    title: '历史的回响',
    description: '展出星河-I、GameBox初代和星信大哥大后，一位老人在展柜前伫立良久。他是当年参与设计这三款产品的工程师，欣然答应接受你的采访。',
    type: 'hidden',
    icon: '📹',
    triggered: false,
    condition: {
      requiredCollections: ['col-xh-001', 'col-xh-004', 'col-xh-005']
    },
    reward: {
      type: 'clue',
      value: '独家访谈线索',
      label: '解锁专属访谈'
    },
    cycle: 0
  },
  {
    id: 'evt-005',
    title: '学生参观团',
    description: '附近大学的历史系组织了参观活动，学生们对这些"古董"电子产品充满好奇。',
    type: 'random',
    icon: '🎓',
    triggered: false,
    condition: {
      minReputation: 25,
      randomChance: 0.4
    },
    reward: {
      type: 'budget',
      value: 8000,
      label: '+¥8,000 团体票收入'
    },
    cycle: 0
  },
  {
    id: 'evt-006',
    title: '科技杂志报道',
    description: '《复古科技》杂志用整整两个版面介绍了你的博物馆。采访记者表示这是他见过最用心的私人收藏展。',
    type: 'milestone',
    icon: '📰',
    triggered: false,
    condition: {
      minReputation: 60
    },
    reward: {
      type: 'reputation',
      value: 25,
      label: '+25 口碑指数'
    },
    cycle: 0
  },
  {
    id: 'evt-007',
    title: '台风来袭',
    description: '台风过境导致停电48小时，部分展区的温湿度控制受到影响。你紧急安排了应急处理。',
    type: 'random',
    icon: '🌪️',
    triggered: false,
    condition: {
      randomChance: 0.15
    },
    reward: {
      type: 'budget',
      value: -5000,
      label: '-¥5,000 紧急维护费'
    },
    cycle: 0
  },
  {
    id: 'evt-008',
    title: '星河之夜',
    description: '你举办了一场仅限VIP的"星河之夜"私人预览会，邀请了当地名流和科技界人士出席。',
    type: 'achievement',
    icon: '🥂',
    triggered: false,
    condition: {
      minScore: 500,
      minReputation: 70
    },
    reward: {
      type: 'budget',
      value: 50000,
      label: '+¥50,000 赞助收入'
    },
    cycle: 0
  },
  {
    id: 'evt-009',
    title: '失落的X-Watch',
    description: '前星河研发主管在新闻上看到了你的博物馆，主动联系表示愿意将自己珍藏的X-Watch原型机捐赠给博物馆。他说："它终于找到了归宿。"',
    type: 'hidden',
    icon: '⌚',
    triggered: false,
    condition: {
      requiredClues: ['clue-005'],
      minReputation: 65,
      randomChance: 0.6
    },
    reward: {
      type: 'collection',
      value: 'X-Watch原型机',
      label: '获得传说藏品'
    },
    cycle: 0
  },
  {
    id: 'evt-010',
    title: '品牌合作邀约',
    description: '一家复刻复古风格的潮牌找上门，希望联名推出博物馆周边产品。',
    type: 'milestone',
    icon: '🤝',
    triggered: false,
    condition: {
      minScore: 600,
      minReputation: 80
    },
    reward: {
      type: 'budget',
      value: 80000,
      label: '+¥80,000 联名授权费'
    },
    cycle: 0
  }
];

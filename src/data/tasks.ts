import { SpecialTask } from '../types';

export const INITIAL_TASKS: SpecialTask[] = [
  {
    id: 'task-001',
    title: '初次鉴定',
    description: '完成你的第一次藏品年代鉴定',
    icon: '🔍',
    category: 'collection',
    progress: 0,
    target: 1,
    completed: false,
    claimed: false,
    reward: {
      type: 'budget',
      value: 5000,
      label: '+¥5,000 预算'
    }
  },
  {
    id: 'task-002',
    title: '修复专家',
    description: '修复3件藏品的残缺说明',
    icon: '🔧',
    category: 'collection',
    progress: 0,
    target: 3,
    completed: false,
    claimed: false,
    reward: {
      type: 'reputation',
      value: 10,
      label: '+10 口碑指数'
    }
  },
  {
    id: 'task-003',
    title: '布置达人',
    description: '将5件藏品布置到展柜中展出',
    icon: '🖼️',
    category: 'exhibition',
    progress: 0,
    target: 5,
    completed: false,
    claimed: false,
    reward: {
      type: 'budget',
      value: 10000,
      label: '+¥10,000 预算'
    }
  },
  {
    id: 'task-004',
    title: '口碑经营',
    description: '回复5位访客的问题',
    icon: '💬',
    category: 'reputation',
    progress: 0,
    target: 5,
    completed: false,
    claimed: false,
    reward: {
      type: 'reputation',
      value: 15,
      label: '+15 口碑指数'
    }
  },
  {
    id: 'task-005',
    title: '历史探索者',
    description: '解锁3条研究线索',
    icon: '📜',
    category: 'research',
    progress: 2,
    target: 3,
    completed: false,
    claimed: false,
    reward: {
      type: 'budget',
      value: 8000,
      label: '+¥8,000 预算'
    }
  },
  {
    id: 'task-006',
    title: '稀有猎手',
    description: '收藏2件史诗或传说级藏品',
    icon: '💎',
    category: 'collection',
    progress: 0,
    target: 2,
    completed: false,
    claimed: false,
    reward: {
      type: 'reputation',
      value: 25,
      label: '+25 口碑指数'
    }
  },
  {
    id: 'task-007',
    title: '完美配件',
    description: '为任意藏品匹配全部配件',
    icon: '🧩',
    category: 'collection',
    progress: 0,
    target: 1,
    completed: false,
    claimed: false,
    reward: {
      type: 'budget',
      value: 12000,
      label: '+¥12,000 预算'
    }
  },
  {
    id: 'task-008',
    title: '专题首秀',
    description: '馆藏评分达到300分',
    icon: '🏛️',
    category: 'exhibition',
    progress: 0,
    target: 300,
    completed: false,
    claimed: false,
    reward: {
      type: 'reputation',
      value: 20,
      label: '+20 口碑指数'
    }
  },
  {
    id: 'task-009',
    title: '配件大师',
    description: '累计匹配10个配件',
    icon: '🔩',
    category: 'collection',
    progress: 0,
    target: 10,
    completed: false,
    claimed: false,
    reward: {
      type: 'budget',
      value: 15000,
      label: '+¥15,000 预算'
    }
  },
  {
    id: 'task-010',
    title: '黄金年代',
    description: '展出4件1990年代的产品',
    icon: '📅',
    category: 'exhibition',
    progress: 0,
    target: 4,
    completed: false,
    claimed: false,
    reward: {
      type: 'reputation',
      value: 18,
      label: '+18 口碑指数'
    }
  }
];

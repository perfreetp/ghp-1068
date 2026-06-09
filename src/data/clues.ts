import { ResearchClue } from '../types';

export const INITIAL_CLUES: ResearchClue[] = [
  {
    id: 'clue-001',
    title: '车库创业的故事',
    content: '1982年，四位刚从大学毕业的年轻人在一个租来的车库中开始了他们的创业之旅。最初的启动资金仅有5万元，全部来自家人的支持。第一台星河-0原型机就是在这里被手工焊接出来的。',
    unlocked: true,
    unlockCondition: '游戏开始自动解锁',
    relatedCollectionIds: ['auc-xh-101', 'col-xh-001'],
    interviews: [
      {
        id: 'int-001-1',
        person: '陈志远',
        role: '星河科技创始人·CEO',
        avatar: '👨‍💼',
        content: '那个夏天很热，车库里没有空调。我们四个人光膀子焊接主板，汗滴在电路板上，经常短路。但就是在那样的环境里，我们造出了改变自己命运的机器。',
        unlocked: true
      }
    ],
    connections: ['clue-002', 'clue-005'],
    icon: '🚗'
  },
  {
    id: 'clue-002',
    title: '命名的由来',
    content: '"星河"这个名字源自创始人之一李明远的一个梦。他说梦见自己乘小舟在星河中飘荡，两岸是无数闪烁的芯片。这个名字寓意着：每一颗星星都代表一个用户，汇聚成浩瀚星河。',
    unlocked: true,
    unlockCondition: '游戏开始自动解锁',
    relatedCollectionIds: ['col-xh-001'],
    interviews: [
      {
        id: 'int-002-1',
        person: '李明远',
        role: '星河科技联合创始人·首席设计师',
        avatar: '👨‍🎨',
        content: '那天做了一个很美的梦，醒来就写下了"星河"两个字。其他三个人一开始觉得太文艺了，但最终我们还是选了它。现在回头看，这个名字确实承载了太多。',
        unlocked: true
      }
    ],
    connections: ['clue-001', 'clue-003'],
    icon: '🌌'
  },
  {
    id: 'clue-003',
    title: '教育市场的突破',
    content: '1985年发布的星河-I能够成功，关键在于抓住了教育信息化的政策窗口。星河团队与十多所重点中学合作，免费提供设备建立计算机教室。这种"种子策略"为后续的销量爆发奠定了口碑基础。',
    unlocked: false,
    unlockCondition: '收藏星河-I并展出',
    requiredReputation: 30,
    relatedCollectionIds: ['col-xh-001'],
    interviews: [
      {
        id: 'int-003-1',
        person: '王建国',
        role: '星河科技早期销售总监',
        avatar: '👨‍🏫',
        content: '我们没有钱打广告，就一家学校一家学校地跑。校长们一开始不信任我们这些毛头小子，但看到孩子们围着电脑眼睛发光的样子，他们就答应试试了。',
        unlocked: false
      }
    ],
    connections: ['clue-002', 'clue-004'],
    icon: '📚'
  },
  {
    id: 'clue-004',
    title: 'GameBox的诞生',
    content: '1994年的GameBox项目最初在公司内部备受质疑。"一家电脑公司为什么要做玩具？"但项目负责人张晓龙坚持认为，游戏是计算机技术走进家庭的最佳切入点。他用自己的年终奖作为赌注，立下了军令状。',
    unlocked: false,
    unlockCondition: '收藏GameBox初代并展出',
    requiredReputation: 40,
    relatedCollectionIds: ['col-xh-004', 'auc-xh-102'],
    interviews: [
      {
        id: 'int-004-1',
        person: '张晓龙',
        role: '星机事业部创始人',
        avatar: '👨‍🎮',
        content: '董事会投票时只有我一个人赞成。我把房契压在桌上说：给我两年时间，不成功我走人。后来的故事大家都知道了，GameBox救了整个公司。',
        unlocked: false
      }
    ],
    connections: ['clue-003', 'clue-006'],
    icon: '🎮'
  },
  {
    id: 'clue-005',
    title: '被取消的智能手表',
    content: '2004年的X-Watch项目在内部代号为"Project Apollo"。这款产品的功能在当时看来近乎科幻：心率监测、消息推送、语音识别、无线充电。但董事会认为"消费者还没准备好"，项目在量产前30天被紧急叫停。',
    unlocked: false,
    unlockCondition: '馆藏评分达到400',
    requiredReputation: 50,
    relatedCollectionIds: ['auc-xh-103'],
    interviews: [
      {
        id: 'int-005-1',
        person: '赵敏',
        role: 'X-Watch项目产品经理',
        avatar: '👩‍🔬',
        content: '被叫停那天，整个团队在会议室哭了。不是因为我们失败了，而是因为我们知道自己走在了时代的前面。十年后，当我戴上Apple Watch时，我笑了——我们是对的。',
        unlocked: false
      },
      {
        id: 'int-005-2',
        person: '陈志远',
        role: '星河科技CEO',
        avatar: '👨‍💼',
        content: '取消X-Watch是我任内最艰难的决定。以当时的电池和芯片技术，成本根本降不下来。但这是我们最宝贵的失败，所有经验都用在了后来的智能手机项目上。',
        unlocked: false
      }
    ],
    connections: ['clue-001', 'clue-007'],
    icon: '⌚'
  },
  {
    id: 'clue-006',
    title: '黄金限定版的秘密',
    content: '1995年GameBox黄金限定版的镀金工艺来自一家日本传统工艺品作坊。每台机身的镀金工序需要耗时72小时，由匠人手工完成。编号#001送给了当时的首相，#042是张晓龙自己的收藏。',
    unlocked: false,
    unlockCondition: '成功拍得GameBox限定版',
    requiredReputation: 60,
    relatedCollectionIds: ['auc-xh-102'],
    interviews: [
      {
        id: 'int-006-1',
        person: '田中先生',
        role: '日本镀金工艺师',
        avatar: '👴',
        content: '中国来的年轻人说要给游戏机镀金，我以为是开玩笑。看到他们认真的样子，我决定接下这活。五台样品中我最满意的就是#042号，金层厚度最均匀。',
        unlocked: false
      }
    ],
    connections: ['clue-004', 'clue-008'],
    icon: '🏆'
  },
  {
    id: 'clue-007',
    title: '4K电视的先驱者',
    content: '2008年CES展台上的4K概念电视震惊了整个行业。这台概念机的面板技术来自星河与台湾面板厂的秘密合作。虽然最终因液晶供应链不成熟未能量产，但相关专利后来被多家公司授权使用。',
    unlocked: false,
    unlockCondition: '研究台解锁3条线索后',
    requiredCycle: 3,
    relatedCollectionIds: ['auc-xh-105'],
    interviews: [
      {
        id: 'int-007-1',
        person: '林博士',
        role: '星河显示技术首席科学家',
        avatar: '👨‍🔬',
        content: '2008年展出那台4K电视时，同行都以为我们在造假。因为当时连1080p都没普及。但我们确实做出了原型，只是4K内容的匮乏让它生不逢时。',
        unlocked: false
      }
    ],
    connections: ['clue-005'],
    icon: '📺'
  },
  {
    id: 'clue-008',
    title: 'Hi-Fi音响的情怀',
    content: '星韵系列Hi-Fi功放是星河产品线中的一个"异类"。它从来不是利润中心，但坚持生产了二十年。陈志远说："公司赚钱了，总得有人做些不为赚钱的事。"星河的工程师们会在周末带着自己DIY的音箱来公司比拼。',
    unlocked: false,
    unlockCondition: '口碑指数达到70',
    requiredReputation: 70,
    relatedCollectionIds: ['col-xh-002', 'col-xh-007', 'auc-xh-104'],
    interviews: [
      {
        id: 'int-008-1',
        person: '老周',
        role: '星韵音响首席调音师',
        avatar: '👨‍🎵',
        content: '功放量产那天，我把自己关在听音室里听了一整夜的贝多芬。不是为了测试，是真的感动。那声音里有我们每一个人的青春。',
        unlocked: false
      }
    ],
    connections: ['clue-006'],
    icon: '🎵'
  }
];

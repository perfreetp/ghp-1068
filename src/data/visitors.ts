import { VisitorFeedback } from '../types';

const visitorNames = [
  '张伟', '李娜', '王芳', '刘洋', '陈静',
  '杨帆', '赵磊', '孙悦', '周杰', '吴敏',
  '郑凯', '黄磊', '林婷', '徐鹏', '何欣',
  '科技老顽童', '复古爱好者', '数码控小王', '80后大叔', '游戏机收藏家',
  '博物馆志愿者', '退休工程师', '历史系学生', '记者小刘', '投资人陈总'
];

const avatars = ['👨', '👩', '👴', '👵', '🧑', '👨‍💼', '👩‍🎓', '🧓', '👨‍🔧', '👩‍💻'];

const positiveComments = [
  '这个展览太棒了！让我想起了小时候家里的第一台电脑。',
  '没想到星河科技有这么悠久的历史，长见识了！',
  '藏品保存得真好，那个随身听我也有过一台！',
  '策展很用心，年代脉络非常清晰。',
  'GameBox！我的童年啊！泪流满面。',
  '第一次见到这么完整的星河产品收藏，震撼！',
  '给孩子讲了我们那个年代的科技史，很有教育意义。',
  '展览的灯光设计很专业，氛围感满分。',
  '那个原型机太珍贵了，博物馆太有实力了！',
  '明天要带朋友再来一次！'
];

const neutralComments = [
  '展品还不错，但说明牌字太小了。',
  '如果能有互动体验区就更好了。',
  '参观路线有点绕，容易迷路。',
  '希望能增加更多产品的技术参数介绍。',
  '展柜有点多，看得眼花缭乱。',
  '票价可以再便宜一点。',
  '建议安排讲解员。'
];

const negativeComments = [
  '有些展品的说明不完整，信息不够。',
  '人太多了，挤得看不清楚。',
  '有些年代标注好像不太准确？',
  '二楼空调温度太低了。',
  '纪念品商店周边太少。'
];

const questionTemplates = [
  {
    category: 'history' as const,
    content: '星河科技是哪一年成立的？',
    options: ['1978年', '1982年', '1985年', '1990年'],
    correctOption: 1
  },
  {
    category: 'history' as const,
    content: '星河科技的第一款产品是什么？',
    options: ['个人电脑', '计算器', '收音机', '电视机'],
    correctOption: 1
  },
  {
    category: 'tech' as const,
    content: '星河-I 电脑的处理器是几位的？',
    options: ['4位', '8位', '16位', '32位'],
    correctOption: 1
  },
  {
    category: 'tech' as const,
    content: 'GameBox初代使用的存储介质是？',
    options: ['光盘', '卡带', '软盘', '硬盘'],
    correctOption: 1
  },
  {
    category: 'price' as const,
    content: '星河-I 电脑当年的售价大约是？',
    options: ['500元', '2000元', '5000元', '10000元'],
    correctOption: 2
  },
  {
    category: 'tech' as const,
    content: '星语随身听支持的磁带翻面功能叫什么？',
    options: ['Auto-Reverse', 'Auto-Flip', 'Auto-Turn', 'Auto-Side'],
    correctOption: 0
  },
  {
    category: 'history' as const,
    content: '星河科技的创始人有几位？',
    options: ['2位', '3位', '4位', '5位'],
    correctOption: 2
  },
  {
    category: 'other' as const,
    content: '星图PDA用什么电池供电？',
    options: ['锂电池', 'AA电池', '纽扣电池', '充电镍氢'],
    correctOption: 1
  },
  {
    category: 'tech' as const,
    content: 'Vision 21彩电的屏幕尺寸是多少？',
    options: ['14英寸', '21英寸', '25英寸', '29英寸'],
    correctOption: 1
  },
  {
    category: 'price' as const,
    content: '星信大哥大上市时的售价接近？',
    options: ['2000元', '5000元', '10000元', '20000元'],
    correctOption: 3
  }
];

export const generateVisitorFeedback = (cycle: number, count: number): VisitorFeedback[] => {
  const feedbacks: VisitorFeedback[] = [];
  const now = Date.now();
  
  for (let i = 0; i < count; i++) {
    const isQuestion = Math.random() < 0.35;
    
    if (isQuestion) {
      const qTemplate = questionTemplates[Math.floor(Math.random() * questionTemplates.length)];
      feedbacks.push({
        id: `fb-${cycle}-${i}-${Math.random().toString(36).slice(2, 8)}`,
        visitorName: visitorNames[Math.floor(Math.random() * visitorNames.length)],
        avatar: avatars[Math.floor(Math.random() * avatars.length)],
        type: 'question',
        content: qTemplate.content,
        sentiment: 'neutral',
        questionCategory: qTemplate.category,
        options: qTemplate.options,
        correctOption: qTemplate.correctOption,
        answered: false,
        satisfaction: 50,
        timestamp: now + i * 60000,
        cycle
      });
    } else {
      const rand = Math.random();
      let sentiment: 'positive' | 'neutral' | 'negative';
      let commentPool: string[];
      
      if (rand < 0.55) {
        sentiment = 'positive';
        commentPool = positiveComments;
      } else if (rand < 0.85) {
        sentiment = 'neutral';
        commentPool = neutralComments;
      } else {
        sentiment = 'negative';
        commentPool = negativeComments;
      }
      
      const satisfactionBase = sentiment === 'positive' ? 80 : sentiment === 'neutral' ? 55 : 30;
      
      feedbacks.push({
        id: `fb-${cycle}-${i}-${Math.random().toString(36).slice(2, 8)}`,
        visitorName: visitorNames[Math.floor(Math.random() * visitorNames.length)],
        avatar: avatars[Math.floor(Math.random() * avatars.length)],
        type: 'comment',
        content: commentPool[Math.floor(Math.random() * commentPool.length)],
        sentiment,
        satisfaction: satisfactionBase + Math.floor(Math.random() * 15),
        timestamp: now + i * 60000,
        cycle
      });
    }
  }
  
  return feedbacks;
};

export const INITIAL_VISITOR_FEEDBACK: VisitorFeedback[] = generateVisitorFeedback(1, 8);

import { CompetitorProduct } from '../types';

export const COMPETITORS: CompetitorProduct[] = [
  {
    id: 'comp-001',
    name: 'IBM PC 5150',
    company: 'IBM',
    year: 1981,
    category: 'computer',
    image: '💻',
    specs: [
      { label: '处理器', value: 'Intel 8088 @ 4.77MHz', advantage: false },
      { label: '内存', value: '16KB - 640KB', advantage: false },
      { label: '存储', value: '5.25" 软盘 ×2', advantage: false },
      { label: '系统', value: 'PC-DOS 1.0', advantage: true },
      { label: '售价', value: '$1,565起', advantage: false }
    ],
    marketShare: 42,
    price: 1565 * 2 // 按汇率估算人民币
  },
  {
    id: 'comp-002',
    name: 'Apple Macintosh',
    company: 'Apple',
    year: 1984,
    category: 'computer',
    image: '🍎',
    specs: [
      { label: '处理器', value: 'Motorola 68000 @ 8MHz', advantage: true },
      { label: '内存', value: '128KB - 512KB', advantage: false },
      { label: '存储', value: '3.5" 软驱', advantage: true },
      { label: '图形', value: '512×342 单色', advantage: false },
      { label: '售价', value: '$2,495', advantage: false }
    ],
    marketShare: 18,
    price: 2495 * 2
  },
  {
    id: 'comp-003',
    name: 'Sony Walkman TPS-L2',
    company: 'Sony',
    year: 1979,
    category: 'audio',
    image: '🎧',
    specs: [
      { label: '类型', value: '立体声磁带播放器', advantage: true },
      { label: '续航', value: '8小时 (AA×2)', advantage: false },
      { label: '耳机', value: 'MDR-3L2 头戴式', advantage: true },
      { label: '重量', value: '390g', advantage: false },
      { label: '售价', value: '¥33,000 日元', advantage: false }
    ],
    marketShare: 65,
    price: 2200
  },
  {
    id: 'comp-004',
    name: 'Nintendo Entertainment System',
    company: 'Nintendo',
    year: 1985,
    category: 'game',
    image: '🎮',
    specs: [
      { label: '处理器', value: 'Ricoh 2A03 @ 1.79MHz', advantage: false },
      { label: '显存', value: '2KB', advantage: false },
      { label: '发色数', value: '52色可选16', advantage: true },
      { label: '媒体', value: '卡带 (最大512KB)', advantage: false },
      { label: '售价', value: '$199', advantage: true }
    ],
    marketShare: 80,
    price: 1800
  },
  {
    id: 'comp-005',
    name: 'Sega Mega Drive',
    company: 'Sega',
    year: 1988,
    category: 'game',
    image: '🕹️',
    specs: [
      { label: '处理器', value: 'Motorola 68000 @ 7.6MHz', advantage: true },
      { label: '显存', value: '64KB', advantage: true },
      { label: '发色数', value: '512色可选64', advantage: true },
      { label: '媒体', value: '卡带 (最大4MB)', advantage: false },
      { label: '售价', value: '$189', advantage: false }
    ],
    marketShare: 35,
    price: 1700
  },
  {
    id: 'comp-006',
    name: 'Motorola DynaTAC 8000X',
    company: 'Motorola',
    year: 1983,
    category: 'phone',
    image: '📞',
    specs: [
      { label: '类型', value: '第一代模拟手机', advantage: true },
      { label: '通话时间', value: '30分钟', advantage: false },
      { label: '待机', value: '8小时', advantage: false },
      { label: '重量', value: '790g (砖机)', advantage: false },
      { label: '售价', value: '$3,995', advantage: false }
    ],
    marketShare: 90,
    price: 35000
  },
  {
    id: 'comp-007',
    name: 'Nokia 3310',
    company: 'Nokia',
    year: 2000,
    category: 'phone',
    image: '📟',
    specs: [
      { label: '类型', value: 'GSM 900/1800', advantage: true },
      { label: '通话时间', value: '4.5小时', advantage: true },
      { label: '待机', value: '260小时', advantage: true },
      { label: '存储', value: '200条通讯录', advantage: false },
      { label: '游戏', value: '内置贪吃蛇', advantage: true }
    ],
    marketShare: 70,
    price: 2200
  },
  {
    id: 'comp-008',
    name: 'Sony Discman D-50',
    company: 'Sony',
    year: 1984,
    category: 'audio',
    image: '💿',
    specs: [
      { label: '类型', value: '全球首款便携CD机', advantage: true },
      { label: '解码', value: '16-bit PCM', advantage: true },
      { label: '频响', value: '20Hz - 20kHz', advantage: true },
      { label: '重量', value: '590g', advantage: false },
      { label: '售价', value: '$350', advantage: false }
    ],
    marketShare: 85,
    price: 3200
  },
  {
    id: 'comp-009',
    name: 'Sony Trinitron KV-21FX',
    company: 'Sony',
    year: 1995,
    category: 'tv',
    image: '📺',
    specs: [
      { label: '尺寸', value: '21英寸 4:3', advantage: true },
      { label: '技术', value: '特丽珑单枪三束', advantage: true },
      { label: '分辨率', value: '576i (PAL)', advantage: false },
      { label: '接口', value: 'AV×2, S-Video, SCART', advantage: true },
      { label: '重量', value: '28kg', advantage: false }
    ],
    marketShare: 55,
    price: 5800
  },
  {
    id: 'comp-010',
    name: 'Apple Newton MessagePad',
    company: 'Apple',
    year: 1993,
    category: 'other',
    image: '📋',
    specs: [
      { label: '类型', value: 'PDA 先驱', advantage: true },
      { label: '处理器', value: 'ARM 610 @ 20MHz', advantage: true },
      { label: '屏幕', value: '336×240 单色触控', advantage: false },
      { label: '功能', value: '手写识别, 日程', advantage: true },
      { label: '售价', value: '$699', advantage: false }
    ],
    marketShare: 40,
    price: 6200
  }
];

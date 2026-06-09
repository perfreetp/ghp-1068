import React, { useState, useMemo } from 'react';
import { useGameStore } from '../store/useGameStore';
import { formatCurrency } from '../utils/formatters';
import { RarityBadge } from '../components/RarityBadge';
import { CATEGORY_ICONS, AUDIENCE_NAMES } from '../types';
import { ClipboardList, Calendar, Users as UsersIcon, BookOpen, Star, FileText, Printer, Download, Sparkles } from 'lucide-react';

const THEME_OPTIONS = [
  { value: 'tech_history', label: '科技发展史' },
  { value: 'classic_review', label: '经典产品回顾' },
  { value: 'memory', label: '年代记忆' },
  { value: 'evolution', label: '技术演进' },
  { value: 'special', label: '限定特展' }
];

const AUDIENCE_OPTIONS = [
  { value: 'students', label: '学生群体' },
  { value: 'workers', label: '上班族' },
  { value: 'elderly', label: '退休老人' },
  { value: 'enthusiast', label: '科技爱好者' },
  { value: 'designers', label: '设计从业者' },
  { value: 'family', label: '家庭游客' }
];

export default function Planning() {
  const plan = useGameStore(s => s.plan);
  const updatePlan = useGameStore(s => s.updatePlan);
  const publishHandbook = useGameStore(s => s.publishHandbook);
  const collections = useGameStore(s => s.collections);
  const collectionScore = useGameStore(s => s.collectionScore);
  const budget = useGameStore(s => s.budget);

  const [exhibitionName, setExhibitionName] = useState(plan.theme);
  const [themeDesc, setThemeDesc] = useState(plan.themeDescription);
  const [themeType, setThemeType] = useState('tech_history');
  const [startYear, setStartYear] = useState(plan.startYear);
  const [endYear, setEndYear] = useState(plan.endYear);
  const [audiences, setAudiences] = useState<string[]>([plan.targetAudience]);
  const [expectedVisitors, setExpectedVisitors] = useState(plan.brochureCount);
  const [budgetAllocation, setBudgetAllocation] = useState({
    maintenance: 30,
    marketing: 30,
    activity: 25,
    guide: 15
  });

  const exhibitedCollections = useMemo(() =>
    collections.filter(c => c.location === 'exhibition'),
  [collections]);

  const handbookCost = useMemo(() => {
    return Math.floor(3000 + expectedVisitors * 2);
  }, [expectedVisitors]);

  const themeScores = useMemo(() => {
    const exhibited = exhibitedCollections;
    const decadeFit = exhibited.filter(c => c.actualYear >= startYear && c.actualYear <= endYear).length;
    const decadeScore = exhibited.length > 0 ? Math.round((decadeFit / exhibited.length) * 100) : 0;
    const completeness = exhibited.filter(c => c.isAuthenticated && c.isRestored).length;
    const completenessScore = exhibited.length > 0 ? Math.round((completeness / exhibited.length) * 100) : 50;
    const avgRarityScore = exhibited.length > 0
      ? Math.round(exhibited.reduce((sum, c) => sum + (c.rarity === 'legendary' ? 100 : c.rarity === 'epic' ? 80 : c.rarity === 'rare' ? 60 : c.rarity === 'uncommon' ? 40 : 20), 0) / exhibited.length)
      : 30;
    const themeFitScore = plan.themeFitScore || 60;
    const repBonus = Math.min(100, 20 + (collectionScore / 10));
    return { decadeScore, completenessScore, avgRarityScore, themeFitScore, repBonus };
  }, [exhibitedCollections, startYear, endYear, plan.themeFitScore, collectionScore]);

  const totalScore = useMemo(() => {
    const s = themeScores;
    return Math.round((s.decadeScore + s.completenessScore + s.avgRarityScore + s.themeFitScore + s.repBonus) / 5);
  }, [themeScores]);

  const starCount = Math.min(5, Math.max(1, Math.round(totalScore / 20)));

  const handleBudgetChange = (key: keyof typeof budgetAllocation, value: number) => {
    setBudgetAllocation(prev => ({ ...prev, [key]: value }));
  };

  const toggleAudience = (val: string) => {
    setAudiences(prev =>
      prev.includes(val) ? prev.filter(a => a !== val) : [...prev, val]
    );
  };

  const handlePublish = () => {
    updatePlan({
      theme: exhibitionName,
      themeDescription: themeDesc,
      startYear,
      endYear,
      brochureCount: expectedVisitors,
      handbookTitle: `${exhibitionName} - 典藏册`
    });
    publishHandbook();
  };

  const scoreDimensions = [
    { label: '年代契合度', score: themeScores.decadeScore, color: 'bg-museum-darkgreen' },
    { label: '展品完整度', score: themeScores.completenessScore, color: 'bg-blue-500' },
    { label: '稀有度', score: themeScores.avgRarityScore, color: 'bg-purple-500' },
    { label: '主题契合度', score: themeScores.themeFitScore, color: 'bg-museum-brass' },
    { label: '口碑加成', score: themeScores.repBonus, color: 'bg-museum-wine' }
  ];

  return (
    <div className="min-h-screen museum-bg parchment-texture p-6">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-6">
          <h1 className="text-3xl font-serif font-bold text-museum-darkgreen mb-2 flex items-center gap-3">
            <ClipboardList className="w-8 h-8 text-museum-brass" />
            📋 展览策划中心
            <span className="ml-auto text-sm font-sans font-normal text-museum-ink/60 flex gap-4">
              <span className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                当前主题：<span className="font-semibold text-museum-darkgreen">{THEME_OPTIONS.find(t => t.value === themeType)?.label}</span>
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                适配年代：<span className="font-mono font-bold text-museum-brass">{startYear}-{endYear}</span>
              </span>
              <span className="flex items-center gap-1">
                <UsersIcon className="w-4 h-4" />
                受众类型：<span className="font-semibold">{audiences.length}类</span>
              </span>
              <span className="flex items-center gap-1">
                预计手册成本：<span className="font-mono font-bold text-museum-wine">{formatCurrency(handbookCost)}</span>
              </span>
            </span>
          </h1>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-5">
            <div className="card-museum p-5">
              <h2 className="section-title">展览策划表单</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="label-museum block mb-2">展览名称</label>
                  <input
                    type="text"
                    value={exhibitionName}
                    onChange={e => setExhibitionName(e.target.value)}
                    placeholder="输入展览名称..."
                    className="input-museum w-full"
                  />
                </div>
                <div className="col-span-2">
                  <label className="label-museum block mb-2">主题描述</label>
                  <textarea
                    value={themeDesc}
                    onChange={e => setThemeDesc(e.target.value)}
                    rows={3}
                    placeholder="描述展览的主题和内容..."
                    className="input-museum w-full resize-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="label-museum block mb-2">主题类型</label>
                  <select
                    value={themeType}
                    onChange={e => setThemeType(e.target.value)}
                    className="input-museum w-full"
                  >
                    {THEME_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="label-museum block mb-2">
                    年代范围：<span className="font-mono text-museum-brass">{startYear} - {endYear}</span>
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-museum-ink/50 w-10">起始</span>
                      <input
                        type="range" min={1975} max={2025}
                        value={startYear}
                        onChange={e => setStartYear(Math.min(Number(e.target.value), endYear))}
                        className="flex-1 accent-museum-darkgreen"
                      />
                      <span className="text-xs font-mono w-14 text-right">{startYear}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-museum-ink/50 w-10">结束</span>
                      <input
                        type="range" min={1975} max={2025}
                        value={endYear}
                        onChange={e => setEndYear(Math.max(Number(e.target.value), startYear))}
                        className="flex-1 accent-museum-wine"
                      />
                      <span className="text-xs font-mono w-14 text-right">{endYear}</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="label-museum block mb-2">目标受众</label>
                  <div className="grid grid-cols-2 gap-2">
                    {AUDIENCE_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => toggleAudience(opt.value)}
                        className={`text-sm py-2 px-3 rounded-lg border-2 transition-all text-left ${
                          audiences.includes(opt.value)
                            ? 'border-museum-brass bg-museum-brass/15 text-museum-darkgreen font-semibold'
                            : 'border-museum-brass/20 bg-museum-cream text-museum-ink/60 hover:border-museum-brass/40'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="label-museum block mb-2">
                    预期访客量：<span className="font-mono text-museum-brass">{expectedVisitors} 人</span>
                  </label>
                  <input
                    type="range" min={500} max={5000} step={100}
                    value={expectedVisitors}
                    onChange={e => setExpectedVisitors(Number(e.target.value))}
                    className="w-full accent-museum-brass"
                  />
                  <div className="flex justify-between text-xs text-museum-ink/40 font-mono mt-1">
                    <span>500</span><span>2750</span><span>5000</span>
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="label-museum block mb-2">
                    预算分配
                    <span className="ml-2 font-mono text-xs text-museum-ink/50">
                      （合计：{Object.values(budgetAllocation).reduce((a, b) => a + b, 0)}%）
                    </span>
                  </label>
                  <div className="space-y-3">
                    {[
                      { key: 'maintenance', label: '展品维护', color: 'accent-museum-darkgreen' },
                      { key: 'marketing', label: '营销推广', color: 'accent-museum-brass' },
                      { key: 'activity', label: '活动体验', color: 'accent-museum-wine' },
                      { key: 'guide', label: '导览服务', color: 'accent-blue-500' }
                    ].map(item => (
                      <div key={item.key} className="flex items-center gap-3">
                        <span className="text-xs text-museum-ink/60 w-16 shrink-0">{item.label}</span>
                        <input
                          type="range" min={0} max={100}
                          value={budgetAllocation[item.key as keyof typeof budgetAllocation]}
                          onChange={e => handleBudgetChange(item.key as keyof typeof budgetAllocation, Number(e.target.value))}
                          className={`flex-1 ${item.color}`}
                        />
                        <span className="text-xs font-mono w-10 text-right font-bold text-museum-darkgreen">
                          {budgetAllocation[item.key as keyof typeof budgetAllocation]}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-4">
            <div className="card-museum p-5 border-4 border-museum-brass/30 bg-gradient-to-b from-[#f8f1dc] to-museum-parchment">
              <div className="border-2 border-dashed border-museum-brass/40 rounded-xl p-5 bg-[#fdf8eb] shadow-inner">
                <div className="text-center mb-4 pb-4 border-b-2 border-museum-brass/30">
                  <div className="text-xs text-museum-brass tracking-widest mb-1">EST. 1982 · 星河档案馆</div>
                  <h3 className="text-xl font-serif font-bold text-museum-ink mb-1">
                    📜 星河产品手册 - 第{collectionScore > 0 ? Math.ceil(collectionScore / 100) : 1}期
                  </h3>
                  <div className="text-sm text-museum-ink/60">{exhibitionName || '未命名展览'}</div>
                </div>
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-museum-ink/50">📅 主题年代</span>
                    <span className="font-mono font-semibold">{startYear} - {endYear}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-museum-ink/50">🎨 展览主题</span>
                    <span className="font-semibold">{THEME_OPTIONS.find(t => t.value === themeType)?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-museum-ink/50">👤 策展人</span>
                    <span className="font-semibold text-museum-darkgreen">你</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-museum-ink/50">🏛️ 展出藏品</span>
                    <span className="font-mono font-bold">{exhibitedCollections.length} 件</span>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="text-xs text-museum-ink/50 mb-2 font-serif">📦 展品名录</div>
                  <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto scrollbar-thin">
                    {exhibitedCollections.length === 0 ? (
                      <div className="col-span-4 text-center py-6 text-museum-ink/30 text-xs">
                        暂无展出藏品
                      </div>
                    ) : (
                      exhibitedCollections.slice(0, 12).map(c => (
                        <div key={c.id} className="text-center">
                          <div className="w-full aspect-square rounded-lg bg-museum-cream/80 border border-museum-brass/20 flex items-center justify-center text-2xl mb-1">
                            {c.image || CATEGORY_ICONS[c.category]}
                          </div>
                          <div className="text-[9px] text-museum-ink/60 truncate">{c.name}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mb-4">
                  <button className="flex-1 btn-secondary text-xs py-2 flex items-center justify-center gap-1">
                    <Printer className="w-3 h-3" />打印预览
                  </button>
                  <button className="flex-1 btn-secondary text-xs py-2 flex items-center justify-center gap-1">
                    <Download className="w-3 h-3" />PDF导出
                  </button>
                </div>
                <button
                  onClick={handlePublish}
                  disabled={budget < handbookCost}
                  className="w-full btn-gold py-3 flex items-center justify-center gap-2 font-bold"
                >
                  <Sparkles className="w-4 h-4" />
                  发布展览手册（花费 {formatCurrency(handbookCost)}）
                </button>
              </div>
            </div>
          </div>

          <div className="col-span-3 space-y-6">
            <div className="card-museum p-5">
              <h2 className="section-title flex items-center gap-2">
                <Star className="w-4 h-4 text-museum-brass" />
                主题评分
              </h2>
              <div className="text-center mb-6">
                <div className="text-xs text-museum-ink/50 mb-1">馆藏总分</div>
                <div className="text-5xl font-serif font-bold text-museum-darkgreen">
                  {collectionScore}
                </div>
                <div className="text-xs text-museum-ink/40">/ 1000</div>
              </div>
              <div className="space-y-3 mb-5">
                {scoreDimensions.map(dim => (
                  <div key={dim.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-museum-ink/60">{dim.label}</span>
                      <span className="font-mono font-bold text-museum-darkgreen">{dim.score}</span>
                    </div>
                    <div className="h-2.5 bg-museum-brass/15 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${dim.color} transition-all rounded-full`}
                        style={{ width: `${dim.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-museum-brass/20">
                <div className="text-xs text-museum-ink/50 mb-2 text-center">预计吸引力</div>
                <div className="flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star
                      key={i}
                      className={`w-7 h-7 ${i <= starCount ? 'text-museum-gold fill-museum-gold' : 'text-museum-brass/20'}`}
                    />
                  ))}
                </div>
                <div className="text-center mt-2 text-sm font-serif font-bold text-museum-darkgreen">
                  {starCount === 5 ? '震撼级' : starCount === 4 ? '卓越级' : starCount === 3 ? '优秀级' : starCount === 2 ? '一般级' : '入门级'}
                </div>
              </div>
            </div>
            <div className="card-museum p-5 bg-gradient-to-br from-museum-brass/10 to-transparent">
              <div className="text-xs text-museum-ink/50 mb-1">策划摘要</div>
              <div className="text-sm text-museum-ink/80 leading-relaxed italic font-serif">
                "{themeDesc || '暂无主题描述'}"
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

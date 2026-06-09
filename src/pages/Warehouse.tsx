import React, { useState, useMemo } from 'react';
import { useGameStore } from '../store/useGameStore';
import { CollectionCard } from '../components/CollectionCard';
import { RarityBadge } from '../components/RarityBadge';
import { Search, Filter, Package, Award, Wrench, Eye, Home, X, Check, Search as SearchIcon, Lightbulb } from 'lucide-react';
import { CATEGORY_NAMES, CATEGORY_ICONS, RARITY_NAMES } from '../types';
import { formatCurrency } from '../utils/formatters';

export default function Warehouse() {
  const collections = useGameStore(s => s.collections);
  const selectedId = useGameStore(s => s.selectedCollectionId);
  const setSelected = useGameStore(s => s.setSelectedCollection);
  const authenticate = useGameStore(s => s.authenticateCollection);
  const restore = useGameStore(s => s.restoreCollection);
  const matchAccessory = useGameStore(s => s.matchAccessory);
  const budget = useGameStore(s => s.budget);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [rarityFilter, setRarityFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [authYear, setAuthYear] = useState(2000);

  const stats = useMemo(() => ({
    total: collections.length,
    notAuth: collections.filter(c => !c.isAuthenticated).length,
    notRestored: collections.filter(c => !c.isRestored).length,
    onExhibit: collections.filter(c => c.location === 'exhibition').length,
    inWarehouse: collections.filter(c => c.location === 'warehouse').length
  }), [collections]);

  const filtered = useMemo(() => {
    return collections.filter(c => {
      if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (categoryFilter !== 'all' && c.category !== categoryFilter) return false;
      if (rarityFilter !== 'all' && c.rarity !== rarityFilter) return false;
      if (locationFilter !== 'all' && c.location !== locationFilter) return false;
      return true;
    });
  }, [collections, search, categoryFilter, rarityFilter, locationFilter]);

  const selected = collections.find(c => c.id === selectedId);

  return (
    <div className="min-h-screen museum-bg parchment-texture p-6">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-6">
          <h1 className="text-3xl font-serif font-bold text-museum-darkgreen mb-4 flex items-center gap-3">
            <span>📦</span>
            藏品仓库
            <span className="ml-auto text-sm font-sans font-normal text-museum-ink/60">
              预算：<span className="font-mono text-museum-brass font-bold">{formatCurrency(budget)}</span>
            </span>
          </h1>
          <div className="grid grid-cols-5 gap-3">
            {[
              { label: '藏品总数', value: stats.total, icon: Package, color: 'text-museum-darkgreen' },
              { label: '未鉴定', value: stats.notAuth, icon: SearchIcon, color: 'text-blue-600' },
              { label: '待修复', value: stats.notRestored, icon: Wrench, color: 'text-museum-wine' },
              { label: '已展出', value: stats.onExhibit, icon: Eye, color: 'text-museum-darkgreen' },
              { label: '在仓库', value: stats.inWarehouse, icon: Home, color: 'text-museum-brass' }
            ].map((s, i) => (
              <div key={i} className="card-museum p-4 flex items-center gap-3">
                <div className={`${s.color}`}>
                  <s.icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-mono font-bold text-museum-ink">{s.value}</div>
                  <div className="text-xs text-museum-ink/60">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-museum p-4 mb-6 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-museum-brass" />
            <input
              type="text"
              placeholder="搜索藏品名称..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-museum w-56"
            />
          </div>
          <div className="h-6 w-px bg-museum-brass/30" />
          <Filter className="w-4 h-4 text-museum-brass" />
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="input-museum w-36"
          >
            <option value="all">全部分类</option>
            {Object.entries(CATEGORY_NAMES).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <select
            value={rarityFilter}
            onChange={e => setRarityFilter(e.target.value)}
            className="input-museum w-32"
          >
            <option value="all">全部稀有度</option>
            {Object.entries(RARITY_NAMES).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <select
            value={locationFilter}
            onChange={e => setLocationFilter(e.target.value)}
            className="input-museum w-32"
          >
            <option value="all">全部位置</option>
            <option value="warehouse">在仓库</option>
            <option value="exhibition">已展出</option>
            <option value="auction">拍卖中</option>
          </select>
          <span className="ml-auto text-sm text-museum-ink/60">
            共 <span className="font-mono font-bold text-museum-darkgreen">{filtered.length}</span> 件藏品
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map(item => (
            <CollectionCard
              key={item.id}
              item={item}
              size="md"
              draggable={true}
              showActions={true}
            />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-16 text-museum-ink/40">
              <Package className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>暂无符合条件的藏品</p>
            </div>
          )}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-museum-ink/40"
            onClick={() => setSelected(null)}
          />
          <div className="relative w-[440px] h-full bg-museum-cream border-l-4 border-museum-brass shadow-2xl animate-slide-in-right overflow-y-auto scrollbar-thin">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <RarityBadge rarity={selected.rarity} size="md" />
                    {selected.location === 'warehouse' && (
                      <span className="tag bg-blue-100 text-blue-700">在仓库</span>
                    )}
                    {selected.location === 'exhibition' && (
                      <span className="tag bg-green-100 text-green-700">已展出</span>
                    )}
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-museum-ink">{selected.name}</h2>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="p-2 rounded-lg hover:bg-museum-brass/20 transition-colors"
                >
                  <X className="w-5 h-5 text-museum-ink/60" />
                </button>
              </div>

              <div className="flex items-center justify-center py-8 mb-4 rounded-xl bg-museum-parchment/50 border-2 border-dashed border-museum-brass/30">
                <span className="text-7xl" style={{ filter: `drop-shadow(0 4px 12px ${selected.color}44)` }}>
                  {selected.image || CATEGORY_ICONS[selected.category]}
                </span>
              </div>

              {!selected.isAuthenticated ? (
                <div className="card-museum p-4 mb-4 border-l-4 border-l-blue-500">
                  <h3 className="font-serif font-bold text-museum-darkgreen mb-3 flex items-center gap-2">
                    <SearchIcon className="w-4 h-4" />
                    藏品鉴定
                  </h3>
                  <p className="text-sm text-museum-ink/70 mb-3">
                    请选择您认为的生产年份（范围1975-2025）：
                  </p>
                  <div className="mb-3">
                    <input
                      type="range"
                      min={1975}
                      max={2025}
                      value={authYear}
                      onChange={e => setAuthYear(Number(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-museum-ink/50 font-mono mt-1">
                      <span>1975</span>
                      <span className="text-lg font-bold text-blue-600">{authYear}年</span>
                      <span>2025</span>
                    </div>
                  </div>
                  <button
                    onClick={() => authenticate(selected.id, authYear)}
                    className="w-full btn-primary flex items-center justify-center gap-2"
                  >
                    <Award className="w-4 h-4" />
                    提交鉴定（花费 ¥800）
                  </button>
                </div>
              ) : (
                <div className="card-museum p-4 mb-4 border-l-4 border-l-green-500 bg-green-50/30">
                  <h3 className="font-serif font-bold text-green-700 mb-2 flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    鉴定完成
                  </h3>
                  <p className="text-sm text-museum-ink/70">
                    生产年代：<span className="font-mono font-bold text-museum-darkgreen">{selected.actualYear}年</span>
                    {selected.estimatedYear !== null && selected.estimatedYear !== undefined && (
                      <span className="text-xs text-museum-ink/50 ml-2">
                        （您的判断：{selected.estimatedYear}年）
                      </span>
                    )}
                  </p>
                </div>
              )}

              {!selected.isRestored ? (
                <div className="card-museum p-4 mb-4 border-l-4 border-l-museum-wine">
                  <h3 className="font-serif font-bold text-museum-darkgreen mb-3 flex items-center gap-2">
                    <Wrench className="w-4 h-4" />
                    藏品修复
                  </h3>
                  <div className="p-3 rounded-lg bg-museum-parchment/60 mb-3 border border-museum-brass/20">
                    <p className="text-sm text-museum-ink/80 italic">
                      "{selected.partialDescription}"
                    </p>
                    <p className="text-xs text-museum-ink/40 mt-2">（说明不完整，需要修复后查看完整信息）</p>
                  </div>
                  <button
                    onClick={() => restore(selected.id)}
                    className="w-full btn-secondary flex items-center justify-center gap-2"
                  >
                    <Wrench className="w-4 h-4" />
                    开始修复（花费 ¥1,500）
                  </button>
                </div>
              ) : (
                <div className="card-museum p-4 mb-4 border-l-4 border-l-green-500 bg-green-50/30">
                  <h3 className="font-serif font-bold text-green-700 mb-2 flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    修复完成
                  </h3>
                  <p className="text-sm text-museum-ink/80 italic">"{selected.description}"</p>
                </div>
              )}

              {selected.accessories.length > 0 && (
                <div className="card-museum p-4 mb-4 border-l-4 border-l-museum-brass">
                  <h3 className="font-serif font-bold text-museum-darkgreen mb-3 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    配件匹配
                    <span className="ml-auto text-xs font-mono text-museum-brass font-bold">
                      {selected.accessoriesMatched}/{selected.accessoriesTotal}
                    </span>
                  </h3>
                  <div className="space-y-2">
                    {selected.accessories.map(acc => (
                      <div
                        key={acc.id}
                        className={`p-3 rounded-lg border-2 transition-all flex items-center gap-3 ${
                          acc.matched
                            ? 'border-green-400 bg-green-50/50'
                            : 'border-museum-brass/30 bg-museum-cream'
                        }`}
                      >
                        <span className="text-2xl">{acc.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm text-museum-ink">{acc.name}</div>
                          <div className="text-xs text-museum-ink/50 truncate">{acc.description}</div>
                        </div>
                        {acc.matched ? (
                          <span className="p-1.5 rounded-full bg-green-500 text-white">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <button
                            onClick={() => matchAccessory(selected.id, acc.id)}
                            className="btn-primary text-xs py-1.5 px-3 whitespace-nowrap"
                          >
                            匹配配件
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="card-museum p-4">
                <h3 className="font-serif font-bold text-museum-darkgreen mb-3 flex items-center gap-2">
                  📋 藏品详情
                </h3>
                <div className="space-y-2.5 text-sm">
                  {[
                    ['名称', selected.name],
                    ['稀有度', RARITY_NAMES[selected.rarity]],
                    ['估值', formatCurrency(selected.estimatedValue)],
                    ['评分', `${selected.score} 分`],
                    ['分类', `${CATEGORY_ICONS[selected.category]} ${selected.categoryName}`],
                    ['年代', `${selected.actualYear}年`],
                    ['来源', selected.source],
                  ].map(([k, v], i) => (
                    <div key={i} className="flex justify-between items-center pb-2 border-b border-museum-brass/15 last:border-0">
                      <span className="text-museum-ink/60">{k}</span>
                      <span className="font-semibold text-museum-ink">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

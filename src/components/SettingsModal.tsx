import React, { useState, useRef } from 'react';
import { X, Save, Download, Upload, Trash2, Info, Clock } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';

const SAVE_KEY = 'product-museum-save-v1';
const VERSION = 'v1.0.0';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'save' | 'about'>('save');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { saveGame, loadGame, clearProgress } = useGameStore();

  if (!isOpen) return null;

  const getLastSaveTime = () => {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return '暂无存档';
      const parsed = JSON.parse(raw);
      if (!parsed.savedAt) return '暂无存档';
      const date = new Date(parsed.savedAt);
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return '暂无存档';
    }
  };

  const handleExport = () => {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) {
        alert('暂无存档可导出');
        return;
      }
      const dataStr = JSON.stringify(JSON.parse(raw), null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const dateStr = new Date().toISOString().slice(0, 10);
      link.download = `product-museum-save-${dateStr}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      alert('导出失败');
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const data = JSON.parse(content);
        loadGame(data);
        setTimeout(() => {
          window.location.reload();
        }, 300);
      } catch {
        alert('存档文件格式不正确');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleClearProgress = () => {
    if (window.confirm('确定要清空所有进度并重新开始吗？此操作不可恢复！')) {
      clearProgress();
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="card-museum relative w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-lg bg-museum-brown/60 border border-museum-brass/30 hover:bg-museum-brass/30 flex items-center justify-center text-museum-cream transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-museum-brass/30">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-museum-gold to-museum-brass flex items-center justify-center shadow-glow-brass">
            <span className="text-2xl">⚙️</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-serif text-museum-ink tracking-wide">
              游戏设置
            </h2>
            <p className="text-sm text-museum-brown/70 font-serif">
              管理存档与游戏信息
            </p>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('save')}
            className={`flex-1 px-4 py-2.5 rounded-lg font-serif text-sm transition-all ${
              activeTab === 'save'
                ? 'bg-gradient-to-r from-museum-gold to-museum-brass text-museum-ink shadow-glow-brass font-semibold'
                : 'bg-museum-brown/20 text-museum-brown hover:bg-museum-brass/20 border border-museum-brass/30'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <Save className="w-4 h-4" />
              存档管理
            </span>
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`flex-1 px-4 py-2.5 rounded-lg font-serif text-sm transition-all ${
              activeTab === 'about'
                ? 'bg-gradient-to-r from-museum-gold to-museum-brass text-museum-ink shadow-glow-brass font-semibold'
                : 'bg-museum-brown/20 text-museum-brown hover:bg-museum-brass/20 border border-museum-brass/30'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <Info className="w-4 h-4" />
              关于
            </span>
          </button>
        </div>

        {activeTab === 'save' && (
          <div className="space-y-5">
            <div className="bg-museum-brown/10 rounded-xl p-4 border border-museum-brass/20">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-museum-brass" />
                <span className="text-sm font-serif text-museum-brown/80">上次自动存档时间</span>
              </div>
              <p className="text-lg font-bold text-museum-ink font-serif tabular-nums">
                {getLastSaveTime()}
              </p>
            </div>

            <button
              onClick={saveGame}
              className="w-full px-5 py-3 rounded-xl bg-gradient-to-r from-museum-darkgreen to-museum-teal text-white font-bold font-serif flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              <Save className="w-5 h-5" />
              立即保存游戏
            </button>

            <button
              onClick={handleExport}
              className="w-full px-5 py-3 rounded-xl bg-gradient-to-r from-museum-slateblue to-museum-blue text-white font-bold font-serif flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              <Download className="w-5 h-5" />
              导出存档
            </button>

            <button
              onClick={handleImportClick}
              className="w-full px-5 py-3 rounded-xl bg-gradient-to-r from-museum-brass to-museum-gold text-museum-ink font-bold font-serif flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              <Upload className="w-5 h-5" />
              导入存档
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />

            <div className="pt-2 border-t border-museum-brass/20">
              <button
                onClick={handleClearProgress}
                className="w-full px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-bold font-serif flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all"
              >
                <Trash2 className="w-5 h-5" />
                清空进度重新开始
              </button>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="space-y-5">
            <div className="bg-museum-brown/10 rounded-xl p-4 border border-museum-brass/20 text-center">
              <p className="text-sm text-museum-brown/70 font-serif mb-1">游戏版本</p>
              <p className="text-2xl font-bold text-museum-ink font-serif tracking-wider">
                产品考古馆 {VERSION}
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold font-serif text-museum-ink text-lg flex items-center gap-2">
                <span>📖</span> 玩法提示
              </h3>
              <ul className="space-y-2 text-museum-brown text-sm font-serif leading-relaxed">
                <li className="flex gap-2">
                  <span className="text-museum-brass">◆</span>
                  鉴定藏品可以提升收藏分数，误差越小效果越好
                </li>
                <li className="flex gap-2">
                  <span className="text-museum-brass">◆</span>
                  修复藏品可解锁完整背景故事，加分更多
                </li>
                <li className="flex gap-2">
                  <span className="text-museum-brass">◆</span>
                  合理布置展柜，主题契合度越高观众越多
                </li>
                <li className="flex gap-2">
                  <span className="text-museum-brass">◆</span>
                  及时回复访客反馈，可提升口碑和满意度
                </li>
                <li className="flex gap-2">
                  <span className="text-museum-brass">◆</span>
                  拍卖是获取稀有藏品的好机会，但要注意预算
                </li>
                <li className="flex gap-2">
                  <span className="text-museum-brass">◆</span>
                  研究线索解锁独家访谈内容，探索星河历史
                </li>
                <li className="flex gap-2">
                  <span className="text-museum-brass">◆</span>
                  完成特殊任务可获得额外预算和口碑奖励
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-museum-brass/20 text-center">
              <p className="text-xs text-museum-brown/60 font-serif">
                © 星河科技历史馆 · 产品考古馆工作室
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsModal;

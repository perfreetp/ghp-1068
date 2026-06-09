import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle
};

const colorMap = {
  success: 'from-green-500',
  error: 'from-red-500',
  info: 'from-blue-500',
  warning: 'from-amber-500'
};

const bgMap = {
  success: 'bg-green-50 border-green-200',
  error: 'bg-red-50 border-red-200',
  info: 'bg-blue-50 border-blue-200',
  warning: 'bg-amber-50 border-amber-200'
};

export const Notification: React.FC = () => {
  const notification = useGameStore((s) => s.notification);
  const setNotification = useGameStore((s) => s.setNotification);

  if (!notification) return null;

  const Icon = iconMap[notification.type];

  return (
    <div className="fixed top-20 right-6 z-50 animate-slide-in-right max-w-md">
      <div className={`flex items-start gap-3 px-5 py-4 rounded-xl border-2 shadow-2xl ${bgMap[notification.type]}`}>
        <div className={`shrink-0 p-1 rounded-full bg-gradient-to-br ${colorMap[notification.type]} to-white/20`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <p className="flex-1 font-medium text-museum-ink leading-relaxed">
          {notification.message}
        </p>
        <button
          onClick={() => setNotification(null)}
          className="shrink-0 p-1 rounded-lg hover:bg-black/10 transition-colors"
        >
          <X className="w-4 h-4 text-museum-ink/60" />
        </button>
      </div>
    </div>
  );
};

export default Notification;

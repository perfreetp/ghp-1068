export const formatCurrency = (amount: number): string => {
  if (amount >= 10000) {
    return `¥${(amount / 10000).toFixed(1)}万`;
  }
  return `¥${amount.toLocaleString('zh-CN')}`;
};

export const formatFullCurrency = (amount: number): string => {
  return `¥${amount.toLocaleString('zh-CN')}`;
};

export const formatDate = (year: number, month: number = 1, day: number = 1): string => {
  return `${year}年${month}月${day}日`;
};

export const formatYearRange = (start: number, end: number): string => {
  return `${start} - ${end}年代`;
};

export const formatPercentage = (value: number, total: number): string => {
  if (total === 0) return '0%';
  return `${Math.round((value / total) * 100)}%`;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes}分钟`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`;
};

export const getScoreGrade = (score: number): { label: string; color: string } => {
  if (score >= 90) return { label: 'S+', color: '#ffd700' };
  if (score >= 80) return { label: 'S', color: '#c9a85c' };
  if (score >= 70) return { label: 'A', color: '#8b3a3a' };
  if (score >= 60) return { label: 'B', color: '#6b8a9e' };
  if (score >= 50) return { label: 'C', color: '#4a3728' };
  return { label: 'D', color: '#9ca3af' };
};

export const getSentimentEmoji = (sentiment: 'positive' | 'neutral' | 'negative'): string => {
  switch (sentiment) {
    case 'positive': return '😊';
    case 'neutral': return '😐';
    case 'negative': return '😟';
  }
};

export const getSentimentColor = (sentiment: 'positive' | 'neutral' | 'negative'): string => {
  switch (sentiment) {
    case 'positive': return '#22c55e';
    case 'neutral': return '#eab308';
    case 'negative': return '#ef4444';
  }
};

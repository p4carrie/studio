export const STYLE_OPTIONS = [
  { id: 'male', label: '男性風格' },
  { id: 'female', label: '女性風格' },
] as const;

export const CONTEXT_OPTIONS = [
  { id: 'daily-commute', label: '日常通勤', isWork: true },
  { id: 'business-meeting', label: '商務會議', isWork: true },
  { id: 'weekend-outing', label: '週末出遊', isWork: false },
  { id: 'outdoor-sports', label: '戶外運動', isWork: false },
] as const;

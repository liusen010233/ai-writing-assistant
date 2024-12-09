export const publicModules = [
  {
    id: 'math',
    name: '数学计算',
    description: '适合涉及到数学计算的投资写作',
    type: 'public'
  },
  {
    id: 'web-search',
    name: '网络搜索',
    description: 'AI在写作中会自动网络搜索',
    type: 'public'
  },
  {
    id: 'xiaohongshu',
    name: '小红书爆款笔记',
    description: '以小红书的风格来写作',
    type: 'public'
  }
]

export const defaultCustomConfig = {
  name: '',
  description: '',
  parameters: {
    temperature: 0.7,
    maxTokens: 2000,
    // 其他可自定义的参数
  }
} 
import { defineConfig, presetUno, presetIcons } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
  ],
  theme: {
    colors: {
      primary: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
      },
      tattoo: {
        black: '#1a1a1a',
        dark: '#2a2a2a',
        card: '#242424',
        red: '#DC143C',
        gold: '#DAA520',
        cream: '#F5F0E8',
        warm: '#C0B99A',
        brown: '#8B7355',
        border: '#3a3530',
      },
    },
    fontFamily: {
      cinzel: ['Cinzel', 'serif'],
      'cinzel-decorative': ['Cinzel Decorative', 'serif'],
      sans: ['Cinzel', 'Georgia', 'serif'],
    },
  },
  shortcuts: {
    // 卡片
    'tattoo-card':
      'relative bg-tattoo-card border-2 border-tattoo-brown rounded-sm p-6 shadow-lg',
    // 按鈕
    'tattoo-btn-primary':
      'bg-tattoo-red text-tattoo-cream border-2 border-tattoo-gold font-cinzel font-bold uppercase tracking-widest px-6 py-2.5 transition-all hover:bg-tattoo-gold hover:text-tattoo-black cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
    'tattoo-btn-secondary':
      'bg-transparent text-tattoo-gold border-2 border-tattoo-gold font-cinzel font-bold uppercase tracking-widest px-6 py-2.5 transition-all hover:bg-tattoo-gold hover:text-tattoo-black cursor-pointer',
    'tattoo-btn-danger':
      'bg-transparent text-tattoo-red border-2 border-tattoo-red font-cinzel font-bold uppercase tracking-widest px-6 py-2.5 transition-all hover:bg-tattoo-red hover:text-tattoo-cream cursor-pointer',
    // 輸入框
    'tattoo-input':
      'bg-tattoo-dark text-tattoo-cream border-2 border-tattoo-brown rounded-sm px-4 py-2.5 w-full focus:outline-none focus:border-tattoo-gold placeholder-tattoo-warm transition-colors',
    // 表格
    'tattoo-table-header':
      'bg-tattoo-dark text-tattoo-gold font-cinzel uppercase tracking-wider text-xs px-4 py-3',
    'tattoo-table-row':
      'border-b border-tattoo-border text-tattoo-cream hover:bg-tattoo-dark transition-colors',
    'tattoo-table-cell': 'px-4 py-3 text-sm',
    // 導航
    'tattoo-nav-link':
      'flex items-center gap-3 px-4 py-3 text-tattoo-warm font-cinzel text-sm uppercase tracking-wider transition-colors hover:text-tattoo-gold hover:bg-tattoo-border rounded-sm',
    'tattoo-nav-active':
      'flex items-center gap-3 px-4 py-3 text-tattoo-gold font-cinzel text-sm uppercase tracking-wider bg-tattoo-border rounded-sm border-l-2 border-tattoo-gold',
    // 標題
    'tattoo-heading':
      'font-cinzel-decorative text-tattoo-gold uppercase tracking-widest',
    'tattoo-subheading': 'font-cinzel text-tattoo-gold uppercase tracking-wider',
    // 徽章
    'tattoo-badge':
      'inline-block border-2 border-current font-cinzel text-xs uppercase tracking-wider px-2 py-0.5',
    // 分隔線
    'tattoo-divider': 'border-t-2 border-tattoo-brown my-4',
    // 標籤
    'tattoo-label': 'text-tattoo-warm font-cinzel text-xs uppercase tracking-wider mb-1.5 block',
    // 選單
    'tattoo-select':
      'bg-tattoo-dark text-tattoo-cream border-2 border-tattoo-brown rounded-sm px-4 py-2.5 w-full focus:outline-none focus:border-tattoo-gold transition-colors',
  },
})

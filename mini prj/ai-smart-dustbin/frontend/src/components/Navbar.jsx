import { Bell, Search, Sparkles, Moon, Sun } from 'lucide-react';

export default function Navbar({ onAIClick, theme, toggleTheme }) {
  return (
    <nav className="h-16 flex-shrink-0 border-b border-white/5 bg-slate-100/10 dark:bg-slate-900/40 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-30 shadow-lg transition-colors duration-500">
      <div className="flex-1 max-w-2xl flex items-center">
        <div className="relative w-full max-w-md group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search areas, bins, or routes..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-200/50 dark:bg-slate-800/50 border border-white/10 rounded-full text-sm focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-emerald-500/50 text-slate-900 dark:text-slate-200 placeholder-slate-500 transition-all shadow-inner"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button 
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-all hover:scale-110 active:scale-95 shadow-sm"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <button 
          onClick={onAIClick}
          className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full text-sm font-bold transition-all shadow-lg hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0"
        >
          <Sparkles className="h-4 w-4" />
          <span>Ask AI</span>
        </button>
        
        <button className="relative p-2 text-slate-400 hover:text-indigo-500 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 bg-rose-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(251,113,133,0.8)]"></span>
        </button>
      </div>
    </nav>
  );
}

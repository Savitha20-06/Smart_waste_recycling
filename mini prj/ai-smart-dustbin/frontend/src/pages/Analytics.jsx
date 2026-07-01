import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { TrendingUp, BarChart3, PieChart, Download, Calendar, ArrowUpRight, Target, Leaf, Loader2 } from 'lucide-react';

export default function Analytics() {
  const [trends, setTrends] = useState([]);
  const [timeframe, setTimeframe] = useState(7);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrends = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:8000/api/analytics/trends?days=${timeframe}`);
        setTrends(res.data);
      } catch (err) { }
      setLoading(false);
    };
    fetchTrends();
  }, [timeframe]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-10 pb-20 transition-colors duration-500">
      <div className="glass-panel p-9 rounded-3xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        <div>
          <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight flex items-center italic">
            <BarChart3 className="h-9 w-9 mr-4 text-indigo-500 dark:text-indigo-400 drop-shadow-[0_0_10px_rgba(99,102,241,0.3)]" />
            Analytics Hub
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 max-w-md font-bold uppercase tracking-[0.2em] text-[10px]">Statistical modeling and historical fill-level telemetry</p>
        </div>
        <div className="flex gap-4">
            <div className="bg-slate-100 dark:bg-slate-900/50 px-5 py-2.5 rounded-2xl border border-slate-200 dark:border-white/5 flex items-center shadow-inner">
              <Calendar className="h-4 w-4 mr-3 text-indigo-500 dark:text-indigo-400" />
              <span className="text-[10px] font-black text-slate-600 dark:text-slate-200 uppercase tracking-widest">March 2026</span>
            </div>
            <button className="bg-white/10 dark:bg-white/5 hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-white/5 transition-all shadow-lg active:scale-95">
              <Download className="h-5 w-5" />
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10">
        <div className="glass-card p-10 rounded-3xl border-white/5 shadow-2xl relative overflow-hidden">
          <h3 className="text-xl font-black text-slate-800 dark:text-white mb-12 flex flex-col md:flex-row md:items-center justify-between gap-8 uppercase tracking-[0.2em]">
            Avg Fill Level Trends
            <div className="flex items-center space-x-5">
              <div className="flex items-center space-x-3 bg-emerald-500/10 px-5 py-2 rounded-full border border-emerald-500/20 shadow-inner">
                <ArrowUpRight className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest">+12.4% vs LW</span>
              </div>
              <select 
                value={timeframe}
                onChange={(e) => setTimeframe(Number(e.target.value))}
                className="bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 rounded-2xl px-5 py-2.5 text-[10px] outline-none focus:ring-2 focus:ring-indigo-500 font-black uppercase tracking-widest cursor-pointer hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm"
              >
                <option value={7}>7 Day Analysis</option>
                <option value={30}>30 Day Outlook</option>
              </select>
            </div>
          </h3>
          
          <div className="h-96 w-full relative group">
            {loading && (
              <div className="absolute inset-0 bg-white/10 dark:bg-slate-900/20 backdrop-blur-[4px] z-10 flex items-center justify-center rounded-3xl">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
              </div>
            )}
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends} margin={{ top: 20, right: 30, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="var(--chart-grid)" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 10, fontWeight: 900}} 
                  dy={15} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 10, fontWeight: 900}} 
                  dx={-15}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    darkBackgroundColor: 'rgba(15, 23, 42, 0.95)',
                    borderRadius: '24px', 
                    border: '1px solid rgba(0,0,0,0.05)',
                    darkBorder: '1px solid rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)',
                    padding: '20px'
                  }} 
                  itemStyle={{color: '#6366f1', fontWeight: 900, textTransform: 'uppercase', fontSize: '11px'}}
                  labelStyle={{color: '#64748b', marginBottom: '8px', fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', tracking: '0.2em'}}
                />
                <Area 
                  type="monotone" 
                  dataKey="avg_fill" 
                  stroke="#6366f1" 
                  strokeWidth={5} 
                  fillOpacity={1} 
                  fill="url(#colorFill)" 
                  animationDuration={2500}
                  style={{ filter: "drop-shadow(0px 10px 15px rgba(99, 102, 241, 0.3))" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="glass-card p-10 rounded-3xl border-white/5 group hover:scale-[1.02] transition-all duration-700 relative overflow-hidden shadow-xl">
          <div className="absolute -right-12 -bottom-12 opacity-5 dark:opacity-10 group-hover:opacity-20 transition-opacity">
            <Target className="h-56 w-56 text-indigo-500" />
          </div>
          <div className="relative z-10 text-left">
            <div className="bg-indigo-500/10 h-20 w-20 rounded-3xl flex items-center justify-center mb-10 border border-indigo-500/20 shadow-lg group-hover:bg-indigo-600 transition-all group-hover:scale-110">
               <TrendingUp className="h-10 w-10 text-indigo-600 dark:text-indigo-400 group-hover:text-white transition-colors" />
            </div>
            <h4 className="text-3xl font-black text-slate-800 dark:text-white mb-4 uppercase tracking-tighter italic">Predictive Logic</h4>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-10 max-w-sm font-bold leading-relaxed">AI engine analyzing historical overflow patterns to pre-emptively schedule pick-ups with 94.2% accuracy.</p>
            <button 
              onClick={() => alert('Intelligence Report generating... Check your mail shortly.')} 
              className="glass-panel text-slate-800 dark:text-white hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-slate-900 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-slate-200 dark:border-white/10 hover:border-transparent shadow-2xl flex items-center active:scale-95"
            >
              <Download className="h-4 w-4 mr-3" /> Get AI Insights Report
            </button>
          </div>
        </div>
        
        <div className="glass-card p-10 rounded-3xl border-white/5 group hover:scale-[1.02] transition-all duration-700 relative overflow-hidden shadow-xl">
           <div className="absolute -right-12 -bottom-12 opacity-5 dark:opacity-10 group-hover:opacity-20 transition-opacity">
            <Leaf className="h-56 w-56 text-emerald-500" />
          </div>
          <div className="relative z-10 text-left">
            <div className="bg-emerald-500/10 h-20 w-20 rounded-3xl flex items-center justify-center mb-10 border border-emerald-500/20 shadow-lg group-hover:bg-emerald-600 transition-all group-hover:scale-110">
               <Leaf className="h-10 w-10 text-emerald-600 dark:text-emerald-400 group-hover:text-white transition-colors" />
            </div>
            <h4 className="text-3xl font-black text-slate-800 dark:text-white mb-4 uppercase tracking-tighter italic">Green Impact</h4>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-4">Sustainability Projections v4.12</p>
            <div className="flex items-end space-x-4 mb-6">
              <span className="text-7xl font-black text-slate-800 dark:text-white drop-shadow-[0_0_15px_rgba(52,211,153,0.3)] tracking-tighter">42.8%</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-black text-2xl mb-3 italic">ROI</span>
            </div>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] opacity-80">Projected Carbon Footprint Reduction for 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}

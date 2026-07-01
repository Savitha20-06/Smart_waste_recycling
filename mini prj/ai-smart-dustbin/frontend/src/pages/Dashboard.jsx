import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, AlertTriangle, TrendingUp, Navigation, RefreshCw, Leaf, Truck, Activity, CloudSun, Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const summaryRes = await axios.get('http://localhost:8000/api/analytics/summary');
      const trendsRes = await axios.get('http://localhost:8000/api/analytics/trends');
      
      const dist = summaryRes.data.distribution_by_area || {};
      const parsedAreaStats = Object.keys(dist).map(area => ({
        area,
        critical_bins: dist[area].critical
      }));

      setData({
        metrics: summaryRes.data,
        trends: trendsRes.data,
        areaStats: parsedAreaStats
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-full">
        <RefreshCw className="h-8 w-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-screen-2xl mx-auto space-y-6 animate-fade-in text-slate-900 dark:text-slate-100 transition-colors duration-500">
      {/* Header section with Top Bar (Weather & Title) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex justify-between items-center glass-panel p-7 rounded-3xl relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-600"></div>
          <div>
            <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 dark:from-slate-100 to-slate-500 dark:to-slate-400">System Analytics</h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-2 font-black uppercase tracking-[0.2em] opacity-80">Real-time IoT intelligence uplink active</p>
          </div>
          <button 
            onClick={fetchDashboardData}
            className="group flex items-center px-8 py-3.5 bg-indigo-600 dark:bg-emerald-500/10 border border-transparent dark:border-emerald-500/30 rounded-2xl shadow-xl shadow-indigo-600/20 dark:shadow-[0_0_15px_rgba(52,211,153,0.1)] text-xs font-black uppercase tracking-widest text-white dark:text-emerald-400 hover:scale-105 transition-all duration-300 active:scale-95"
          >
            <RefreshCw className="h-4 w-4 mr-3 group-hover:rotate-180 transition-transform duration-700" />
            Sync Telemetry
          </button>
        </div>

        {/* Weather Widget */}
        <div className="glass-panel p-7 rounded-3xl relative overflow-hidden flex items-center justify-between shadow-xl">
          <div className="absolute -right-4 -top-4 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl"></div>
          <div className="z-10">
            <h3 className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em] mb-2 px-1">Coimbatore Hub</h3>
            <p className="text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">{data.metrics.weather.temp}<span className="text-2xl ml-1">°C</span></p>
            <p className="text-xs text-amber-600 dark:text-yellow-400 mt-2 font-black uppercase tracking-widest">{data.metrics.weather.condition}</p>
          </div>
          <div className="z-10 bg-amber-500/10 dark:bg-yellow-500/10 p-5 rounded-2xl border border-amber-500/20 dark:border-yellow-500/20 shadow-lg">
            <CloudSun className="h-9 w-9 text-amber-600 dark:text-yellow-400" />
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Bins', value: data.metrics.total_bins, icon: Trash2, color: 'cyan' },
          { label: 'Critical Alert', value: data.metrics.critical_bins, icon: AlertTriangle, color: 'rose', active: true },
          { label: 'Environmental Impact', value: `${data.metrics.co2_saved_kg} kg`, icon: Leaf, color: 'emerald' },
          { label: 'Network Load', value: `${data.metrics.avg_fill_level?.toFixed(1) || 0}%`, icon: TrendingUp, color: 'indigo' }
        ].map((kpi, i) => (
          <div key={i} className={cn(
            "glass-card rounded-3xl p-7 glass-card-hover group relative overflow-hidden border border-white/5 shadow-xl",
            kpi.active && "ring-2 ring-rose-500/40 shadow-rose-500/10"
          )}>
            <div className={cn("absolute -right-4 -top-4 w-28 h-28 rounded-full blur-3xl opacity-20 transition-all group-hover:opacity-40", `bg-${kpi.color}-500`)}></div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[10px] font-black text-slate-500 dark:text-slate-400 tracking-[0.2em] uppercase">{kpi.label}</h3>
              <div className={cn("p-3 rounded-2xl border transition-all shadow-sm", `bg-${kpi.color}-500/10 border-${kpi.color}-500/20 text-${kpi.color}-600 dark:text-${kpi.color}-400`)}>
                <kpi.icon className="h-5 w-5" />
              </div>
            </div>
            <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Middle Row: Charts & Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-8 rounded-3xl shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight italic">Weekly Efficiency Flow</h3>
            <div className="flex space-x-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse delay-75"></div>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                <XAxis dataKey="day" stroke="#64748b" tick={{fill: '#64748b', fontSize: 10, fontWeight: 800}} axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 10, fontWeight: 800}} axisLine={false} tickLine={false} dx={-10} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    darkBackgroundColor: 'rgba(15, 23, 42, 0.9)',
                    backdropFilter: 'blur(16px)', 
                    border: '1px solid rgba(0,0,0,0.05)', 
                    darkBorder: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '20px', 
                    padding: '12px 20px',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.1)'
                  }}
                  itemStyle={{ fontWeight: 900, fontSize: '12px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="avg_fill" 
                  name="Network Load"
                  stroke="#10b981" 
                  strokeWidth={5}
                  dot={{ r: 6, fill: '#10b981', strokeWidth: 3, stroke: '#fff' }} 
                  activeDot={{ r: 10, fill: '#10b981', strokeWidth: 4, stroke: '#fff' }}
                  style={{ filter: "drop-shadow(0px 8px 12px rgba(16, 185, 129, 0.3))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-8 rounded-3xl flex flex-col items-center shadow-2xl">
          <h3 className="text-xl font-black text-slate-800 dark:text-white w-full text-left mb-2 tracking-tight">Synaptic Hotzones</h3>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold w-full text-left mb-8 uppercase tracking-[0.2em] opacity-70">AI-predicted overflow probability</p>
          <div className="w-full flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.metrics.predictive_hotzones}>
                <PolarGrid stroke="var(--chart-grid)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Threat Level" dataKey="A" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.4} style={{ filter: "drop-shadow(0px 0px 15px rgba(244, 63, 94, 0.4))" }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    backdropFilter: 'blur(16px)', 
                    borderRadius: '16px', 
                    border: 'none',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                  }} 
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row: Active Trucks & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
        
        {/* Active Fleet Tracking */}
        <div className="glass-panel p-8 rounded-3xl shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Active Operation Fleet</h3>
            <button onClick={() => navigate('/map')} className="text-indigo-600 dark:text-emerald-400 hover:underline text-xs font-black uppercase tracking-widest flex items-center transition-all group">
              Full Map View <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform"/>
            </button>
          </div>
          <div className="space-y-5">
            {data.metrics.active_trucks.map((truck, idx) => (
              <div key={idx} className="bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl p-5 flex flex-col space-y-4 hover:shadow-lg transition-all group cursor-pointer active:scale-[0.98]">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="bg-indigo-500/10 dark:bg-indigo-500/20 p-3 rounded-xl text-indigo-600 dark:text-indigo-400 mr-4 shadow-sm">
                      <Truck className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-black text-slate-800 dark:text-slate-100 text-sm tracking-tight">{truck.id}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{truck.location} • <span className="text-emerald-500">{truck.status}</span></p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-slate-700 dark:text-slate-300">{truck.progress}% Dispatch Complete</p>
                  </div>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden shadow-inner">
                  <div className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-1000" style={{ width: `${truck.progress}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="glass-panel p-8 rounded-3xl flex flex-col shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center tracking-tight">
              <Activity className="h-6 w-6 text-rose-500 mr-3 animate-pulse" />
              Live Neural Feed
            </h3>
            <span className="px-3 py-1 bg-rose-500/10 text-rose-600 text-[9px] font-black uppercase tracking-widest rounded-lg border border-rose-500/20 shadow-sm">Real-time Stream</span>
          </div>
          <div className="flex-1 space-y-6 overflow-y-auto pr-3 custom-scrollbar max-h-[400px]">
            {data.metrics.recent_activity.map((act, idx) => (
              <div key={idx} className="flex relative pb-2 group">
                {idx !== data.metrics.recent_activity.length - 1 && (
                  <div className="absolute top-10 left-[15px] bottom-0 w-[2px] bg-slate-100 dark:bg-white/10 group-hover:bg-indigo-500/20 transition-colors"></div>
                )}
                <div className={cn(
                  "h-[30px] w-[30px] rounded-xl flex-shrink-0 z-10 border-2 border-white dark:border-slate-900 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110",
                  act.type === 'warning' ? 'bg-rose-500' : act.type === 'success' ? 'bg-emerald-500' : 'bg-indigo-500'
                )}>
                  {act.type === 'warning' ? <AlertTriangle className="h-3.5 w-3.5 text-white" /> : 
                   act.type === 'success' ? <CheckCircle2 className="h-3.5 w-3.5 text-white" /> :
                   <Clock className="h-3.5 w-3.5 text-white" />}
                </div>
                <div className="ml-5">
                  <p className="text-[13px] font-bold text-slate-800 dark:text-slate-200 tracking-tight leading-relaxed">{act.text}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1.5 opacity-60 italic">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

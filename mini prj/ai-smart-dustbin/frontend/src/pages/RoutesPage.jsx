import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Route as RouteIcon, Map, Clock, Navigation, Loader2, Activity, CheckCircle2 } from 'lucide-react';

export default function RoutesPage() {
  const navigate = useNavigate();
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleOptimize = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/api/routes/optimize');
      setRouteData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 transition-colors duration-500">
      <div className="glass-panel p-8 rounded-3xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight flex items-center">
            <Navigation className="h-8 w-8 mr-4 text-indigo-500 dark:text-indigo-400" />
            Route Optimization
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 max-w-md font-medium leading-relaxed">Precision logistics for critical waste collection. Powered by AI-Nearest-Neighbor logic.</p>
        </div>
        <button 
          onClick={handleOptimize}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-5 rounded-2xl shadow-xl shadow-indigo-500/30 font-black text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 flex items-center disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {loading ? <Loader2 className="h-5 w-5 mr-3 animate-spin" /> : <Activity className="h-5 w-5 mr-3 group-hover:animate-pulse" />}
          Generate Optimal Route
        </button>
      </div>

      {!routeData && !loading && (
        <div className="glass-card p-16 rounded-3xl text-center border-2 border-dashed border-slate-200 dark:border-white/10">
          <div className="bg-slate-100 dark:bg-slate-800/50 h-24 w-24 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner border border-white/10">
            <RouteIcon className="h-10 w-10 text-slate-400 dark:text-slate-500" />
          </div>
          <h3 className="text-2xl font-black text-slate-700 dark:text-slate-200">No active routes generated</h3>
          <p className="text-slate-500 dark:text-slate-500 mt-3 max-w-sm mx-auto font-medium">Click the button above to calculate the most efficient path for currently critical nodes.</p>
        </div>
      )}

      {routeData && (
        <div className="space-y-8 animate-in fade-in zoom-in duration-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-7 rounded-3xl border-white/5 flex items-center group transition-all hover:scale-105 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full -mr-8 -mt-8"></div>
              <div className="bg-indigo-500/10 dark:bg-indigo-500/20 p-5 rounded-2xl mr-5 group-hover:scale-110 transition-transform shadow-lg"><Map className="h-7 w-7 text-indigo-500 dark:text-indigo-400" /></div>
              <div className="z-10">
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest mb-1.5">Total Distance</p>
                <p className="text-4xl font-black text-slate-800 dark:text-white">{routeData.total_distance_km} <span className="text-lg font-bold text-slate-400">km</span></p>
              </div>
            </div>
            <div className="glass-card p-7 rounded-3xl border-white/5 flex items-center group transition-all hover:scale-105 overflow-hidden relative">
               <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full -mr-8 -mt-8"></div>
              <div className="bg-amber-500/10 dark:bg-amber-500/20 p-5 rounded-2xl mr-5 group-hover:scale-110 transition-transform shadow-lg"><Clock className="h-7 w-7 text-amber-500 dark:text-amber-400" /></div>
              <div className="z-10">
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest mb-1.5">Est. Collection Time</p>
                <p className="text-4xl font-black text-slate-800 dark:text-white">{routeData.estimated_time_mins} <span className="text-lg font-bold text-slate-400">mins</span></p>
              </div>
            </div>
            <div className="glass-card p-7 rounded-3xl border-white/5 flex items-center group transition-all hover:scale-105 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-8 -mt-8"></div>
              <div className="bg-emerald-500/10 dark:bg-emerald-500/20 p-5 rounded-2xl mr-5 group-hover:scale-110 transition-transform shadow-lg"><CheckCircle2 className="h-7 w-7 text-emerald-500 dark:text-emerald-400" /></div>
              <div className="z-10">
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest mb-1.5">Nodes In Route</p>
                <p className="text-4xl font-black text-slate-800 dark:text-white">{routeData.bins.length} <span className="text-lg font-bold text-slate-400">bins</span></p>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-3xl border-white/5 overflow-hidden shadow-2xl relative">
            <div className="px-10 py-8 border-b border-gray-100 dark:border-white/5 bg-white/5 flex justify-between items-center">
              <div>
                <h3 className="font-black text-slate-800 dark:text-white text-xl flex items-center uppercase tracking-[0.2em]">
                  Route Map Waypoints
                </h3>
              </div>
              <div className="flex items-center space-x-3 bg-emerald-500/10 px-5 py-2.5 rounded-full border border-emerald-500/20 shadow-inner">
                <span className="h-2 w-2 bg-emerald-500 rounded-full animate-ping"></span>
                <span className="text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-widest">Neural Link: Ready</span>
              </div>
            </div>
            <div>
              {routeData.bins.length === 0 ? (
                <div className="p-16 text-center text-slate-500 font-bold uppercase tracking-widest opacity-50">No critical bins require collection in this sector.</div>
              ) : (
                <ul className="divide-y divide-gray-100 dark:divide-white/5">
                  {routeData.bins.map((bin, i) => (
                    <li key={bin.bin_id} className="px-10 py-8 hover:bg-white/5 flex items-center transition-all group">
                      <div className="h-12 w-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-indigo-500 dark:text-indigo-400 flex items-center justify-center font-black text-sm mr-8 shrink-0 shadow-lg group-hover:bg-indigo-600 group-hover:text-white group-hover:-translate-y-1 transition-all">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                           <p className="font-extrabold text-slate-800 dark:text-white text-xl">{bin.bin_id}</p>
                           <span className="text-[10px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-lg font-black uppercase tracking-widest border border-indigo-500/20">{bin.area}</span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center font-bold">
                          Current Payload: 
                          <span className={`ml-3 font-black px-3 py-1 rounded-lg text-xs tracking-widest ${bin.fill_level > 80 ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'}`}>
                            {bin.fill_level}% FULL
                          </span>
                        </p>
                      </div>
                      <button 
                        onClick={() => navigate(`/map?focus=${bin.bin_id}`)} 
                        className="glass-panel text-slate-800 dark:text-white hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-slate-900 px-7 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-slate-200 dark:border-white/10 hover:border-transparent shadow-xl active:scale-95"
                      >
                        Track Intelligence
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

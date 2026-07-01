import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AlertTriangle, Clock, MapPin, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function Alerts() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/alerts');
      setAlerts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 transition-colors duration-500">
      <div className="glass-panel p-9 rounded-3xl border border-white/5 mb-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-indigo-500"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight flex items-center">
              <AlertTriangle className="h-9 w-9 mr-4 text-rose-500 dark:text-rose-400 drop-shadow-[0_0_10px_rgba(251,113,133,0.3)]" />
              System Alerts
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 max-w-md font-bold uppercase tracking-[0.2em] text-[10px]">Real-time operational intelligence & critical events</p>
          </div>
          <div className="bg-slate-100 dark:bg-slate-900/50 px-5 py-2.5 rounded-2xl border border-slate-200 dark:border-white/5 flex items-center self-start shadow-inner">
            <div className="h-2.5 w-2.5 rounded-full bg-rose-500 mr-3 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.5)]"></div>
            <span className="text-[10px] font-black text-slate-600 dark:text-slate-200 uppercase tracking-widest">Neural Link: Active</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-24 glass-card rounded-3xl border border-white/5">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
          {alerts.length === 0 ? (
            <div className="glass-card p-20 rounded-3xl text-center border-slate-200 dark:border-white/10 border-2 border-dashed">
              <p className="text-slate-400 dark:text-slate-500 font-black text-lg uppercase tracking-widest opacity-60">No critical alerts detected.</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div key={alert.alert_id} className="glass-card border border-white/5 rounded-3xl p-7 flex items-center gap-8 group hover:scale-[1.02] transition-all duration-500 shadow-xl overflow-hidden relative">
                <div className="bg-slate-50 dark:bg-slate-800/80 h-16 w-16 rounded-2xl shadow-lg flex items-center justify-center shrink-0 border border-slate-200 dark:border-white/10 group-hover:bg-indigo-600/10 transition-all">
                  <AlertTriangle className="h-8 w-8 text-rose-500 dark:text-rose-400 animate-pulse" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                    <h4 className="font-extrabold text-slate-800 dark:text-white text-xl tracking-tight group-hover:text-indigo-600 dark:group-hover:text-rose-100 transition-colors uppercase">{alert.message}</h4>
                    <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 flex items-center bg-slate-100 dark:bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/5 shrink-0 uppercase tracking-widest shadow-sm">
                      <Clock className="h-3.5 w-3.5 mr-2 text-indigo-500 dark:text-indigo-400" />
                      {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 mt-4">
                    <span className="bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest shadow-inner ring-1 ring-white/5">
                      NODE ID: <span className="text-indigo-600 dark:text-indigo-400">{alert.bin_id}</span>
                    </span>
                    <button 
                      onClick={() => navigate(`/map?focus=${alert.bin_id}`)} 
                      className="glass-panel text-slate-800 dark:text-white hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-slate-900 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-slate-200 dark:border-white/10 hover:border-transparent shadow-xl active:scale-95 flex items-center"
                    >
                      <MapPin className="h-3.5 w-3.5 mr-2 text-indigo-500 dark:text-indigo-400" /> Locate Intelligent Node
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit2, Loader2, Save, X, Settings, Zap, Database, MapPin } from 'lucide-react';

export default function AdminPanel() {
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBins = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/bins');
      setBins(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBins();
  }, []);

  const handleDelete = async (binId) => {
    if(!window.confirm('Are you sure you want to decommission this node?')) return;
    try {
      await axios.delete(`http://localhost:8000/api/bins/${binId}`);
      setBins(bins.filter(b => b.bin_id !== binId));
    } catch(err) {
      console.error(err);
    }
  };

  const handeEmptyBin = async (binId) => {
    try {
      await axios.post(`http://localhost:8000/api/collect/${binId}`);
      fetchBins(); // Refresh
    } catch (err) {}
  };

  const handleAddBin = async () => {
    const area = window.prompt("Enter Area Name for new bin:");
    if (!area) return;
    try {
      const payload = {
        area,
        latitude: 11.0168 + (Math.random() * 0.1 - 0.05),
        longitude: 76.9558 + (Math.random() * 0.1 - 0.05)
      };
      await axios.post('http://localhost:8000/api/bins', payload);
      fetchBins();
    } catch (err) { }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-10 pb-20 transition-colors duration-500">
      <div className="glass-panel p-9 rounded-3xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
        <div className="flex items-center">
          <div className="bg-indigo-500/10 dark:bg-indigo-500/20 p-5 rounded-2xl mr-6 border border-indigo-500/20 shadow-lg">
            <Settings className="h-9 w-9 text-indigo-500 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">Hardware Control</h1>
            <p className="text-slate-500 dark:text-slate-400 text-[10px] mt-2 font-black uppercase tracking-[0.2em]">Configure IoT sensor network telemetry & node status</p>
          </div>
        </div>
        <button 
          onClick={handleAddBin} 
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-5 rounded-2xl shadow-xl shadow-indigo-600/30 font-black transition-all hover:scale-105 active:scale-95 flex items-center text-xs uppercase tracking-widest border border-white/10 group"
        >
          <Plus className="h-5 w-5 mr-3 group-hover:rotate-90 transition-transform" />
          Deploy Intelligence Node
        </button>
      </div>

      <div className="glass-card rounded-3xl border border-white/5 overflow-hidden shadow-2xl relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-white/5 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em] border-b border-gray-100 dark:border-white/5">
                <th className="px-8 py-8">Node Identifier</th>
                <th className="px-8 py-8">Deployment Zone</th>
                <th className="px-8 py-8">GPS Coordinates</th>
                <th className="px-8 py-8">Payload Density</th>
                <th className="px-8 py-8">System Health</th>
                <th className="px-8 py-8 text-right">Master Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-8 py-24 text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-indigo-500 mx-auto mb-6 drop-shadow-lg" />
                    <p className="text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">Synchronizing Neural Network...</p>
                  </td>
                </tr>
              ) : (
                bins.map((bin) => (
                  <tr key={bin.bin_id} className="hover:bg-indigo-500/5 dark:hover:bg-white/5 transition-all group">
                    <td className="px-8 py-7">
                       <div className="flex items-center space-x-4">
                         <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-white/10 shadow-sm">
                            <Database className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
                         </div>
                         <span className="font-black text-slate-800 dark:text-white text-base tracking-tight">{bin.bin_id}</span>
                       </div>
                    </td>
                    <td className="px-8 py-7">
                       <span className="text-slate-600 dark:text-slate-300 font-bold uppercase text-xs tracking-widest">{bin.area}</span>
                    </td>
                    <td className="px-8 py-7">
                      <div className="flex items-center text-slate-500 dark:text-slate-500 font-mono text-[10px] space-x-2 bg-slate-50 dark:bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/5 w-fit">
                         <MapPin className="h-3 w-3 text-indigo-500 dark:text-indigo-400" />
                         <span>{bin.latitude.toFixed(4)}, {bin.longitude.toFixed(4)}</span>
                      </div>
                    </td>
                    <td className="px-8 py-7">
                      <div className="flex items-center space-x-5">
                        <div className="flex-1 bg-slate-200 dark:bg-slate-800 rounded-full h-3 min-w-[140px] overflow-hidden border border-slate-300 dark:border-white/5 shadow-inner">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${bin.fill_level > 80 ? 'bg-gradient-to-r from-rose-600 to-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.4)]' : 'bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]'}`} 
                            style={{width: `${bin.fill_level}%`}}
                          ></div>
                        </div>
                        <span className="text-xs font-black text-slate-800 dark:text-white w-10">{bin.fill_level}%</span>
                      </div>
                    </td>
                    <td className="px-8 py-7">
                      <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-sm ring-1 flex items-center w-fit ${bin.status === 'critical' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-rose-500/30' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/30'}`}>
                        <div className={`h-1.5 w-1.5 rounded-full mr-2.5 ${bin.status === 'critical' ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                        {bin.status}
                      </span>
                    </td>
                    <td className="px-8 py-7 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={() => handeEmptyBin(bin.bin_id)} 
                          className="glass-panel text-slate-800 dark:text-white hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-slate-900 px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border border-slate-200 dark:border-white/10 hover:border-transparent shadow-xl active:scale-95 flex items-center shrink-0 whitespace-nowrap"
                        >
                          <Zap className="h-3 w-3 mr-2.5 text-amber-500 dark:text-amber-400" /> Purge Cache
                        </button>
                        <button 
                          onClick={() => handleDelete(bin.bin_id)} 
                          className="text-rose-500 hover:bg-rose-600 hover:text-white p-2.5 rounded-xl transition-all border border-rose-500/20 hover:border-transparent shadow-xl flex items-center justify-center shrink-0 active:scale-95"
                          title="Decommission Node"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

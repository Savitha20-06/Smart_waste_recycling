import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, Route, AlertTriangle, BarChart3, Settings, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/map', label: 'Map View', icon: Map },
  { path: '/routes', label: 'Routes', icon: Route },
  { path: '/alerts', label: 'Alerts', icon: AlertTriangle },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/admin', label: 'Admin Panel', icon: Settings },
];

export default function Sidebar({ theme }) {
  return (
    <div className="w-64 h-full border-r border-white/5 bg-slate-100/10 dark:bg-slate-900/40 backdrop-blur-xl flex flex-col z-20 shrink-0 shadow-2xl transition-all duration-500">
      <div className="h-16 flex items-center px-6 border-b border-white/5 shrink-0">
        <Trash2 className="h-6 w-6 text-emerald-500 dark:text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]" />
        <span className="ml-3 font-black text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500">SMART WASTE</span>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-6 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center px-5 py-3 mx-3 rounded-xl transition-all duration-300 group text-sm font-bold tracking-wide",
                isActive 
                  ? "bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-sm" 
                  : "text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-slate-100 hover:bg-white/10 hover:translate-x-1"
              )
            }
          >
            <item.icon className={cn("mr-3 h-5 w-5")} />
            {item.label}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-white/5 shrink-0 bg-slate-100/20 dark:bg-black/20">
        <div className="flex items-center px-4 py-3 bg-white/5 border border-white/10 rounded-xl shadow-inner">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
            AD
          </div>
          <div className="ml-3">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-tight">Admin User</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">City Operations</p>
          </div>
        </div>
      </div>
    </div>
  );
}

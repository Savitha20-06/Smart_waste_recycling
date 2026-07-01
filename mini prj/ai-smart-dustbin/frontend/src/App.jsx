import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import MapView from './pages/MapView';
import RoutesPage from './pages/RoutesPage';
import Alerts from './pages/Alerts';
import Analytics from './pages/Analytics';
import AdminPanel from './pages/AdminPanel';
import AIAssistant from './components/AIAssistant';

function App() {
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <Router>
      <div className={`flex h-screen overflow-hidden font-sans transition-colors duration-500 ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
        <Sidebar theme={theme} />
        <div className="flex-1 flex flex-col relative w-full h-full overflow-hidden">
          <Navbar 
            onAIClick={() => setIsAIOpen(true)} 
            theme={theme} 
            toggleTheme={toggleTheme} 
          />
          <main className="flex-1 overflow-auto bg-transparent">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/map" element={<MapView />} />
              <Route path="/routes" element={<RoutesPage />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          </main>

          {/* AI Assistant Overlay/Panel */}
          <AIAssistant isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
        </div>
      </div>
    </Router>
  );
}

export default App;

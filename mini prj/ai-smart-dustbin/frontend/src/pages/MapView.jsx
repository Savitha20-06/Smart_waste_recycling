import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { Loader2, Navigation, Route as RouteIcon } from 'lucide-react';

import { cn } from '../lib/utils';

const createIcon = (color) => {
  return new L.DivIcon({
    className: 'bg-transparent',
    html: `<div class="w-4 h-4 rounded-full border-2 border-white shadow-lg" style="background-color: ${color}"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -8]
  });
};

const createTruckIcon = () => {
  return new L.DivIcon({
    className: 'bg-transparent',
    html: `<div class="h-10 w-10 bg-indigo-600 dark:bg-indigo-500 rounded-2xl border-2 border-white dark:border-slate-800 flex flex-col items-center justify-center shadow-2xl text-white font-black text-[10px] relative transition-transform hover:scale-110 active:rotate-12"><div class="absolute -top-1 -right-1 h-3.5 w-3.5 bg-emerald-500 rounded-full animate-pulse border-2 border-white dark:border-slate-800 shadow-lg shadow-emerald-500/50"></div>AI</div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
  });
};

function MapController({ centerPosition }) {
  const map = useMap();
  useEffect(() => {
    if (centerPosition) {
      map.flyTo(centerPosition, 16, { animate: true });
    }
  }, [centerPosition, map]);
  return null;
}

export default function MapView() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const focusBinId = searchParams.get('focus');
  
  const [bins, setBins] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [routeWaypoints, setRouteWaypoints] = useState([]);
  const [showRoute, setShowRoute] = useState(false);
  const [loading, setLoading] = useState(true);
  const [center, setCenter] = useState([11.0168, 76.9558]);

  const fetchBins = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/bins');
      setBins(res.data);
      
      try {
        const routeRes = await axios.post('http://localhost:8000/api/routes/optimize');
        if (routeRes.data && routeRes.data.bins) {
          setRouteWaypoints(routeRes.data.bins);
        }
      } catch(e) {}
      
      try {
        const analyticsRes = await axios.get('http://localhost:8000/api/analytics/summary');
        if (analyticsRes.data && analyticsRes.data.active_trucks) {
          setTrucks(analyticsRes.data.active_trucks);
        }
      } catch(e) {}

      // If there is a focusBinId, center on it once loaded
      if (focusBinId && res.data.length > 0) {
        const focusedBin = res.data.find(b => b.bin_id === focusBinId);
        if (focusedBin) {
          setCenter([focusedBin.latitude, focusedBin.longitude]);
        }
      } else if (res.data.length > 0 && loading) {
        setCenter([res.data[0].latitude, res.data[0].longitude]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBins();
    const interval = setInterval(fetchBins, 3000);
    return () => clearInterval(interval);
  }, [focusBinId]);

  const getMarkerColor = (fillLevel) => {
    if (fillLevel > 80) return '#ef4444'; // Red
    if (fillLevel > 50) return '#eab308'; // Yellow
    return '#22c55e'; // Green
  };

  if (loading && bins.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  const isDark = document.documentElement.classList.contains('dark');

  return (
    <div className="h-full w-full relative">
      <MapContainer center={center} zoom={13} scrollWheelZoom={true} className="h-full w-full z-0 font-sans">
        <MapController centerPosition={focusBinId ? center : null} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url={isDark 
            ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          }
        />
        {showRoute && routeWaypoints.length > 0 && (
          <Polyline 
            positions={routeWaypoints.map(w => [w.latitude, w.longitude])} 
            color="#6366f1" 
            weight={6} 
            dashArray="12, 12" 
            opacity={0.9}
            pathOptions={{ className: 'animate-pulse' }}
          />
        )}
        {trucks.map(truck => (
          <Marker
            key={truck.id}
            position={[truck.latitude, truck.longitude]}
            icon={createTruckIcon()}
          >
            <Popup className="premium-popup">
              <div className="p-4 min-w-[160px] bg-white dark:bg-slate-900 rounded-2xl">
                <h3 className="font-black text-slate-800 dark:text-white border-b border-slate-100 dark:border-white/5 pb-3 mb-3 text-base flex items-center italic uppercase tracking-tighter">
                   <Navigation className="h-4 w-4 mr-2 text-indigo-500" />
                   Logistics Unit {truck.id}
                </h3>
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 flex justify-between uppercase tracking-widest">Status: <span className="text-emerald-600 dark:text-emerald-400">{truck.status}</span></p>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 flex justify-between uppercase tracking-widest">Sector: <span className="text-slate-800 dark:text-slate-200">{truck.location}</span></p>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 flex justify-between uppercase tracking-widest">Dispatch: <span className="text-indigo-600 dark:text-indigo-400">{truck.progress}%</span></p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        {bins.map(bin => (
          <Marker 
            key={bin.bin_id} 
            position={[bin.latitude, bin.longitude]}
            icon={createIcon(getMarkerColor(bin.fill_level))}
          >
            <Popup className="premium-popup">
              <div className="p-4 min-w-[200px] bg-white dark:bg-slate-900 rounded-2xl">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3 mb-4">
                   <h4 className="font-black text-slate-800 dark:text-white text-lg italic tracking-tighter uppercase">{bin.bin_id}</h4>
                   <div className={cn("h-3 w-3 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.2)]", bin.fill_level > 80 ? 'bg-rose-500 animate-pulse shadow-rose-500/50' : 'bg-emerald-500')}></div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                    <span>Target Zone</span>
                    <span className="text-slate-800 dark:text-slate-200">{bin.area}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                    <span>Density Log</span>
                    <span className={cn("text-sm", bin.fill_level > 80 ? 'text-rose-600 animate-pulse' : 'text-emerald-600')}>{bin.fill_level}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mb-2">
                     <div className={cn("h-full transition-all duration-1000", bin.fill_level > 80 ? 'bg-rose-500' : 'bg-emerald-500')} style={{width: `${bin.fill_level}%`}}></div>
                  </div>
                </div>
                {bin.fill_level > 80 && (
                  <button 
                    onClick={async () => {
                      await axios.post(`http://localhost:8000/api/collect/${bin.bin_id}`);
                      fetchBins();
                    }}
                    className="mt-6 w-full bg-indigo-600 text-white font-black py-3.5 rounded-xl shadow-xl shadow-indigo-600/30 hover:bg-indigo-500 transition-all text-[10px] uppercase tracking-[0.2em] active:scale-95 border border-white/10"
                  >
                    Initiate Rapid Collection
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Absolute floating button group */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-[400] flex space-x-6">
        <button 
          onClick={() => setShowRoute(!showRoute)}
          className={`px-8 py-4 rounded-2xl shadow-2xl flex items-center font-black text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 border border-white/10 ${
            showRoute 
              ? 'bg-indigo-600 text-white shadow-indigo-500/40' 
              : 'glass-panel text-slate-800 dark:text-white'
          }`}
        >
          <RouteIcon className="h-5 w-5 mr-3" />
          {showRoute ? 'Hide Optimal Route' : 'Show Optimal Route'}
        </button>
        <button 
          onClick={() => navigate('/routes')}
          className="glass-panel text-slate-800 dark:text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center font-black text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 border border-white/10"
        >
          <Navigation className="h-5 w-5 mr-3 text-indigo-500 dark:text-indigo-400" />
          List Directions
        </button>
      </div>
    </div>
  );
}

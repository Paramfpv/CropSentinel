import React, { useState, useEffect } from 'react';
import { ArrowLeft, Settings2, Droplets, Clock, ChevronDown, X, Thermometer, Wind, Cloud, MapPin, Activity, Leaf } from 'lucide-react';
import { useCropSentinel } from '../state/DemoContext';
import { LineChart, Line, AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import wheat from '../assets/wheat.png';
import rice  from '../assets/rice.png';
import { useI18n } from '../I18nContext';

// Fix Leaflet icon
import iconUrl       from 'leaflet/dist/images/marker-icon.png';
import iconShadowUrl from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
L.Marker.prototype.options.icon = L.icon({ iconUrl, shadowUrl: iconShadowUrl, iconSize:[25,41], iconAnchor:[12,41] });

/* ── Farm data ─────────────────────────────────────────────────────────── */
const FARMS = [
  { id:'north', name:'North Field', crop:'Wheat', img:wheat, lat:22.3072, lng:73.1812, area:'6.2', ndvi:'0.61', moisture:'Low',     health:72, soilHealth:'Fair',  alerts:1, ringColor:'#EA580C' },
  { id:'south', name:'South Field', crop:'Rice',  img:rice,  lat:22.3100, lng:73.1850, area:'6.2', ndvi:'0.72', moisture:'Optimal', health:88, soilHealth:'Good',  alerts:0, ringColor:'#22C55E' },
];

/* ── Trend data ─────────────────────────────────────────────────────────── */
const TRENDS = {
  north: {
    ndvi:     [{ d:'May 1',v:0.50 },{ d:'May 15',v:0.55 },{ d:'Jun 1',v:0.52 },{ d:'Jun 15',v:0.58 },{ d:'Jul 1',v:0.61 }],
    moisture: [{ d:'May 1',v:42 },{ d:'May 15',v:38 },{ d:'Jun 1',v:32 },{ d:'Jun 15',v:26 },{ d:'Jul 1',v:18 }],
  },
  south: {
    ndvi:     [{ d:'May 1',v:0.60 },{ d:'May 15',v:0.63 },{ d:'Jun 1',v:0.66 },{ d:'Jun 15',v:0.70 },{ d:'Jul 1',v:0.72 }],
    moisture: [{ d:'May 1',v:58 },{ d:'May 15',v:62 },{ d:'Jun 1',v:60 },{ d:'Jun 15',v:65 },{ d:'Jul 1',v:68 }],
  },
};

/* ── Weather mock ───────────────────────────────────────────────────────── */
const WEATHER = { temp:'31°C', humidity:'56%', rainChance:'10%', wind:'18 km/h', feelsLike:'34°C', uvIndex:'High', condition:'Partly Cloudy' };

/* ── Shared card style ─────────────────────────────────────────────────── */
const card = { background:'var(--cs-card)', borderRadius:20, border:'1px solid var(--cs-border-soft)', boxShadow:'0 1px 6px var(--cs-shadow)', padding:16, marginBottom:12 };

/* ── Custom Tooltip ────────────────────────────────────────────────────── */
function ChartTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:'var(--cs-card)', border:'1px solid var(--cs-border)', borderRadius:8, padding:'4px 10px', fontSize:10 }}>
      <p style={{ margin:0, color:'var(--cs-text-muted)' }}>{label}</p>
      <p style={{ margin:0, color:'var(--cs-accent)', fontWeight:700 }}>{payload[0].value}</p>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   TABS
══════════════════════════════════════════════════════════════════════════ */

function OverviewTab({ farm }) {
  const { state } = useCropSentinel();
  const crisis = state.isCrisisActive && farm.id === 'north';
  const score  = crisis ? 32 : farm.health;
  const r = 44, circ = 2 * Math.PI * r;
  const offset = circ - circ * score / 100;
  const ringColor = crisis ? '#EF4444' : farm.ringColor;

  return (
    <>
      {/* Health ring + quick stats */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:12 }}>
        {/* Ring */}
        <div style={{ ...card, marginBottom:0, display:'flex', flexDirection:'column', alignItems:'center', padding:'16px 12px' }}>
          <p style={{ fontSize:9, color:'var(--cs-text-muted)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', margin:'0 0 10px' }}>Health Score</p>
          <div style={{ position:'relative', width:96, height:96, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="96" height="96" style={{ position:'absolute', inset:0, transform:'rotate(-90deg)' }}>
              <circle cx="48" cy="48" r={r} strokeWidth="7" stroke="var(--cs-border)" fill="transparent" />
              <circle cx="48" cy="48" r={r} strokeWidth="7" stroke={ringColor} fill="transparent"
                strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
            </svg>
            <div style={{ position:'relative', zIndex:1, textAlign:'center' }}>
              <span style={{ fontSize:28, fontWeight:900, color:'var(--cs-text)', lineHeight:1, display:'block' }}>{score}</span>
              <span style={{ fontSize:10, color:'var(--cs-text-muted)' }}>/100</span>
            </div>
          </div>
          <span style={{ marginTop:8, fontSize:10, fontWeight:700, padding:'3px 10px', borderRadius:20,
            background: crisis ? 'var(--cs-danger-light)' : score >= 80 ? 'var(--cs-accent-light)' : 'var(--cs-warning-light)',
            color:      crisis ? 'var(--cs-danger)'       : score >= 80 ? 'var(--cs-accent)'        : '#D97706' }}>
            {crisis ? 'Critical' : score >= 80 ? 'Healthy' : 'Drought Risk'}
          </span>
        </div>

        {/* Quick stats */}
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {[
            { label:'NDVI',        value: crisis ? '0.21' : farm.ndvi, color: 'var(--cs-accent)' },
            { label:'Moisture',    value: farm.moisture,               color: '#60A5FA' },
            { label:'Soil Health', value: farm.soilHealth,             color: 'var(--cs-text)' },
            { label:'Area',        value: farm.area + ' ac',           color: 'var(--cs-text)' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ ...card, marginBottom:0, padding:'10px 14px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <p style={{ fontSize:10, color:'var(--cs-text-muted)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.04em', margin:0 }}>{label}</p>
              <p style={{ fontSize:14, fontWeight:900, color, margin:0 }}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Alerts */}
      {farm.alerts > 0 && (
        <div style={{ ...card, background:'var(--cs-danger-light)', border:'1px solid var(--cs-danger-border)', display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:36, height:36, borderRadius:12, background:'var(--cs-danger)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <Activity size={16} style={{ color:'#fff' }} />
          </div>
          <div>
            <p style={{ fontSize:13, fontWeight:700, color:'var(--cs-text)', margin:0 }}>Drought Risk Detected</p>
            <p style={{ fontSize:11, color:'var(--cs-text-muted)', margin:'2px 0 0' }}>Moisture level critically low</p>
          </div>
        </div>
      )}
    </>
  );
}

function SatelliteTab({ farm }) {
  return (
    <>
      {/* Map */}
      <div style={{ ...card, padding:0, overflow:'hidden', borderRadius:20 }}>
        <div style={{ height:220, width:'100%' }}>
          <MapContainer center={[farm.lat, farm.lng]} zoom={14} style={{ width:'100%', height:'100%' }}
            zoomControl={false} attributionControl={false}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[farm.lat, farm.lng]} />
          </MapContainer>
        </div>
        {/* Health gradient legend */}
        <div style={{ padding:'10px 14px', borderTop:'1px solid var(--cs-border-soft)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
            <span style={{ fontSize:9, color:'var(--cs-text-muted)', fontWeight:600 }}>Low Health</span>
            <span style={{ fontSize:9, color:'var(--cs-text-muted)', fontWeight:600 }}>High Health</span>
          </div>
          <div style={{ height:6, borderRadius:3, background:'linear-gradient(to right, #EF4444, #EAB308, #22C55E)' }} />
        </div>
      </div>

      {/* Coordinates */}
      <div style={{ ...card, display:'flex', alignItems:'center', gap:12 }}>
        <MapPin size={18} style={{ color:'var(--cs-accent)', flexShrink:0 }} />
        <div>
          <p style={{ fontSize:10, color:'var(--cs-text-muted)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em', margin:0 }}>Farm Coordinates</p>
          <p style={{ fontSize:14, fontWeight:700, color:'var(--cs-text)', margin:'2px 0 0' }}>
            {farm.lat.toFixed(4)}°N, {farm.lng.toFixed(4)}°E
          </p>
        </div>
      </div>

      {/* NDVI badge */}
      <div style={{ ...card }}>
        <p style={{ fontSize:12, fontWeight:700, color:'var(--cs-text)', margin:'0 0 10px' }}>Vegetation Index (NDVI)</p>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ fontSize:32, fontWeight:900, color:'var(--cs-accent)' }}>{farm.ndvi}</span>
          <div style={{ flex:1, height:8, background:'var(--cs-border)', borderRadius:4, overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${parseFloat(farm.ndvi)*100}%`, background:'linear-gradient(to right, #EF4444, #22C55E)', borderRadius:4 }} />
          </div>
        </div>
      </div>
    </>
  );
}

function TrendsTab({ farm }) {
  const data = TRENDS[farm.id];
  return (
    <>
      {/* NDVI Trend */}
      <div style={card}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
          <p style={{ fontSize:13, fontWeight:700, color:'var(--cs-text)', margin:0 }}>NDVI Trend</p>
          <span style={{ fontSize:13, fontWeight:900, color:'var(--cs-accent)' }}>{farm.ndvi}</span>
        </div>
        <div style={{ height:100 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.ndvi} margin={{ top:4, right:4, left:-20, bottom:0 }}>
              <defs>
                <linearGradient id="ndviGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--cs-accent)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--cs-accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--cs-border)" vertical={false} />
              <XAxis dataKey="d" tick={{ fontSize:8, fill:'var(--cs-text-muted)' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize:8, fill:'var(--cs-text-muted)' }} tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTip />} />
              <Area type="monotone" dataKey="v" stroke={farm.ringColor} strokeWidth={2} fill="url(#ndviGrad)" dot={{ r:2.5, fill:farm.ringColor, strokeWidth:0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Moisture Trend */}
      <div style={card}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
          <p style={{ fontSize:13, fontWeight:700, color:'var(--cs-text)', margin:0 }}>Soil Moisture Trend</p>
          <span style={{ fontSize:13, fontWeight:900, color:'#60A5FA' }}>{farm.moisture}</span>
        </div>
        <div style={{ height:100 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.moisture} margin={{ top:4, right:4, left:-20, bottom:0 }}>
              <defs>
                <linearGradient id="moistGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#60A5FA" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#60A5FA" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--cs-border)" vertical={false} />
              <XAxis dataKey="d" tick={{ fontSize:8, fill:'var(--cs-text-muted)' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize:8, fill:'var(--cs-text-muted)' }} tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTip />} />
              <Area type="monotone" dataKey="v" stroke="#60A5FA" strokeWidth={2} fill="url(#moistGrad)" dot={{ r:2.5, fill:'#60A5FA', strokeWidth:0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}

function WeatherTab({ farm }) {
  const ITEMS = [
    { icon: Thermometer, label:'Temperature',   value:'31°C',      color:'#EF4444' },
    { icon: Droplets,    label:'Humidity',       value:'56%',       color:'#60A5FA' },
    { icon: Cloud,       label:'Rain Chance',    value:'10%',       color:'#93C5FD' },
    { icon: Wind,        label:'Wind Speed',     value:'18 km/h',   color:'#6EE7B7' },
    { icon: Thermometer, label:'Feels Like',     value:'34°C',      color:'#F97316' },
    { icon: Leaf,        label:'UV Index',       value:'High',      color:'#A78BFA' },
  ];
  return (
    <>
      {/* Condition banner */}
      <div style={{ ...card, textAlign:'center', padding:'20px 16px' }}>
        <p style={{ fontSize:11, color:'var(--cs-text-muted)', fontWeight:600, margin:'0 0 4px', textTransform:'uppercase', letterSpacing:'0.06em' }}>
          {farm.name} — Current Conditions
        </p>
        <p style={{ fontSize:28, fontWeight:900, color:'var(--cs-text)', margin:0 }}>Partly Cloudy ⛅</p>
        <p style={{ fontSize:13, color:'var(--cs-text-sec)', margin:'4px 0 0' }}>Good day for field inspection</p>
      </div>

      {/* Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        {ITEMS.map(({ icon: Icon, label, value, color }) => (
          <div key={label} style={{ ...card, marginBottom:0, display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:36, height:36, borderRadius:12, background:'var(--cs-bg)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <Icon size={16} style={{ color }} />
            </div>
            <div>
              <p style={{ fontSize:9, color:'var(--cs-text-muted)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.04em', margin:0 }}>{label}</p>
              <p style={{ fontSize:15, fontWeight:800, color:'var(--cs-text)', margin:0 }}>{value}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   FARM SELECTOR SHEET
══════════════════════════════════════════════════════════════════════════ */
function FarmSelectorSheet({ farms, selectedId, onSelect, onClose }) {
  return (
    <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.55)', zIndex:200, display:'flex', alignItems:'flex-end' }}
      onClick={onClose}>
      <div style={{ width:'100%', maxWidth:420, margin:'0 auto', background:'var(--cs-card)', borderRadius:'26px 26px 0 0', padding:'20px 20px 36px', boxShadow:'0 -4px 30px rgba(0,0,0,0.25)' }}
        onClick={e => e.stopPropagation()}>
        {/* Handle */}
        <div style={{ width:40, height:4, background:'var(--cs-border)', borderRadius:2, margin:'0 auto 20px' }} />
        <p style={{ fontSize:13, fontWeight:700, color:'var(--cs-text)', margin:'0 0 14px' }}>Select Field</p>
        {farms.map(f => (
          <button key={f.id}
            onClick={() => { onSelect(f.id); onClose(); }}
            style={{ width:'100%', display:'flex', alignItems:'center', gap:14, padding:'12px 14px', borderRadius:16, border: f.id === selectedId ? '2px solid var(--cs-accent)' : '1px solid var(--cs-border-soft)', background: f.id === selectedId ? 'var(--cs-accent-light)' : 'var(--cs-bg)', marginBottom:8, cursor:'pointer', fontFamily:'inherit' }}>
            <img src={f.img} alt={f.crop} style={{ width:36, height:36, objectFit:'contain' }} />
            <div style={{ textAlign:'left' }}>
              <p style={{ fontSize:14, fontWeight:800, color:'var(--cs-text)', margin:0 }}>{f.name}</p>
              <p style={{ fontSize:11, color:'var(--cs-text-muted)', margin:0 }}>{f.crop} · {f.area} acres</p>
            </div>
            {f.id === selectedId && <span style={{ marginLeft:'auto', fontSize:11, fontWeight:700, color:'var(--cs-accent)', background:'var(--cs-accent-light)', padding:'2px 8px', borderRadius:8 }}>Active</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   MAIN SCREEN
══════════════════════════════════════════════════════════════════════════ */
const TABS = ['Overview', 'Satellite', 'Trends', 'Weather'];

export default function FarmsScreen({ onNavigate }) {
  const { t } = useI18n();
  const [selectedFarmId, setSelectedFarmId] = useState('north');
  const [activeTab,      setActiveTab]      = useState(0);
  const [showSheet,      setShowSheet]      = useState(false);

  const farm = FARMS.find(f => f.id === selectedFarmId);

  const renderTab = () => {
    switch (activeTab) {
      case 0: return <OverviewTab  farm={farm} />;
      case 1: return <SatelliteTab farm={farm} />;
      case 2: return <TrendsTab    farm={farm} />;
      case 3: return <WeatherTab   farm={farm} />;
      default: return null;
    }
  };

  return (
    <div className="content-max" style={{ display:'flex', flexDirection:'column', height:'100%', background:'var(--cs-bg)', overflow:'hidden' }}>

      {/* ── Sticky Header ── */}
      <div style={{ flexShrink:0, padding:'18px 16px 10px', background:'var(--cs-bg)', borderBottom:'1px solid var(--cs-border-soft)' }}>
        {/* Top row */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
          <button onClick={() => onNavigate('home')}
            style={{ width:34, height:34, borderRadius:'50%', background:'var(--cs-card)', border:'1px solid var(--cs-border-soft)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', boxShadow:'0 1px 4px var(--cs-shadow)' }}>
            <ArrowLeft size={16} strokeWidth={2.2} style={{ color:'var(--cs-text)' }} />
          </button>
          <h1 style={{ fontSize:16, fontWeight:800, color:'var(--cs-text)', margin:0 }}>Field Overview</h1>
          <button style={{ width:34, height:34, borderRadius:'50%', background:'var(--cs-card)', border:'1px solid var(--cs-border-soft)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', boxShadow:'0 1px 4px var(--cs-shadow)' }}>
            <Settings2 size={15} strokeWidth={1.8} style={{ color:'var(--cs-text-sec)' }} />
          </button>
        </div>

        {/* Farm selector */}
        <button onClick={() => setShowSheet(true)}
          style={{ width:'100%', display:'flex', alignItems:'center', gap:12, padding:'12px 14px', background:'var(--cs-card)', border:'1px solid var(--cs-border-soft)', borderRadius:18, cursor:'pointer', boxShadow:'0 1px 4px var(--cs-shadow)', fontFamily:'inherit', marginBottom:12 }}>
          <img src={farm.img} alt={farm.crop} style={{ width:36, height:36, objectFit:'contain' }} />
          <div style={{ textAlign:'left', flex:1 }}>
            <p style={{ fontSize:15, fontWeight:900, color:'var(--cs-text)', margin:0 }}>{farm.name}</p>
            <p style={{ fontSize:11, color:'var(--cs-text-muted)', margin:0, fontWeight:500 }}>{farm.crop}</p>
          </div>
          <ChevronDown size={18} style={{ color:'var(--cs-text-muted)' }} />
        </button>

        {/* Tab bar */}
        <div style={{ display:'flex', gap:0, background:'var(--cs-bg)', borderRadius:14, border:'1px solid var(--cs-border-soft)', overflow:'hidden' }}>
          {TABS.map((tab, i) => (
            <button key={tab} onClick={() => setActiveTab(i)}
              style={{ flex:1, padding:'9px 0', border:'none', cursor:'pointer', fontFamily:'inherit', transition:'all 0.18s',
                background: i === activeTab ? 'var(--cs-accent)' : 'transparent',
                color:      i === activeTab ? '#FFFFFF' : 'var(--cs-text-muted)',
                fontSize: 11, fontWeight: 700,
                borderRight: i < TABS.length-1 ? '1px solid var(--cs-border-soft)' : 'none',
              }}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── Scrollable content ── */}
      <div style={{ flex:1, overflowY:'auto', padding:'12px 14px 0', WebkitOverflowScrolling:'touch' }}>
        {renderTab()}

        {/* Bottom CTA */}
        <button onClick={() => onNavigate('intervention')}
          style={{ width:'100%', background:'var(--cs-accent)', color:'#FFFFFF', fontWeight:800, fontSize:15, padding:'16px', borderRadius:18, border:'none', cursor:'pointer', boxShadow:'0 4px 16px rgba(74,124,89,0.35)', fontFamily:'inherit', letterSpacing:'0.1px', marginBottom:24 }}>
          View Intervention
        </button>
      </div>

      {/* ── Farm selector sheet ── */}
      {showSheet && (
        <FarmSelectorSheet
          farms={FARMS}
          selectedId={selectedFarmId}
          onSelect={id => { setSelectedFarmId(id); setActiveTab(0); }}
          onClose={() => setShowSheet(false)}
        />
      )}
    </div>
  );
}

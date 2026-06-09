import React, { useState } from 'react';
import { TrendingUp, Droplets, Thermometer, Leaf } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { useI18n } from '../I18nContext';

const NDVI_DATA     = [{date:'May 1',v:0.42},{date:'May 15',v:0.47},{date:'Jun 1',v:0.50},{date:'Jun 15',v:0.55},{date:'Jul 1',v:0.61}];
const MOISTURE_DATA = [{date:'May 1',v:38},{date:'May 15',v:42},{date:'Jun 1',v:35},{date:'Jun 15',v:28},{date:'Jul 1',v:22}];
const TEMP_DATA     = [{date:'May 1',v:28},{date:'May 15',v:30},{date:'Jun 1',v:32},{date:'Jun 15',v:34},{date:'Jul 1',v:31}];

const TABS   = ['NDVI Trend', 'Moisture', 'Temperature'];
const COLORS = ['var(--cs-accent)', '#60A5FA', '#EF4444'];

const INSIGHTS = [
  { icon: Leaf,        color:'var(--cs-accent)', bg:'var(--cs-accent-light)', title:'NDVI improving over the last 15 days', sub:'Keep up the good work!'     },
  { icon: Droplets,    color:'#EF4444',           bg:'var(--cs-danger-light)',  title:'Moisture stress detected',            sub:'Recommend irrigation'        },
  { icon: Thermometer, color:'#D97706',           bg:'var(--cs-warning-light)', title:'High temperature forecast',           sub:'Monitor crop water needs'   },
];

// Custom tooltip that respects dark theme
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div style={{ background:'var(--cs-card)', border:'1px solid var(--cs-border)', borderRadius:10, padding:'6px 10px', fontSize:11 }}>
        <p style={{ margin:0, color:'var(--cs-text-muted)', fontWeight:600 }}>{label}</p>
        <p style={{ margin:'2px 0 0', color:'var(--cs-text)', fontWeight:700 }}>{payload[0].value}</p>
      </div>
    );
  }
  return null;
}

export default function InsightsScreen() {
  const { t } = useI18n();
  const [tab, setTab] = useState(0);

  const data   = [NDVI_DATA, MOISTURE_DATA, TEMP_DATA][tab];
  const color  = ['#4A7C59', '#60A5FA', '#EF4444'][tab]; // keep chart line colors fixed
  const label  = ['0.61', '22%', '31°C'][tab];
  const change = ['+12%', '-15%', '+8%'][tab];

  return (
    <div className="content-max" style={{ display:'flex', flexDirection:'column', minHeight:'100%', background:'var(--cs-bg)' }}>
      {/* Header */}
      <div style={{ padding:'24px 20px 12px' }}>
        <h1 style={{ fontSize:20, fontWeight:900, color:'var(--cs-text)', margin:0 }}>Insights</h1>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:10, padding:'0 20px 20px', overflowX:'auto', WebkitOverflowScrolling:'touch', flexShrink:0 }}>
        {['NDVI (Health)', 'Soil Moisture', 'Temperature'].map((tabLabel, i) => (
          <button key={tabLabel} onClick={() => setTab(i)} style={{
            background: tab === i ? 'var(--cs-accent)' : 'var(--cs-card)',
            color:      tab === i ? '#FFFFFF' : 'var(--cs-text-muted)',
            border:     `1px solid ${tab === i ? 'var(--cs-accent)' : 'var(--cs-border-soft)'}`,
            padding:    '8px 16px', borderRadius:20, fontSize:12, fontWeight:700,
            cursor:'pointer', whiteSpace:'nowrap', transition:'all 0.2s',
            boxShadow:  tab === i ? '0 2px 8px rgba(74,124,89,0.3)' : 'none',
          }}>
            {tabLabel}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="desktop-split desktop-split-2-1" style={{ flex:1, overflowY:'auto', padding:'0 20px', WebkitOverflowScrolling:'touch' }}>
        
        {/* Chart card (Left side on desktop) */}
        <div style={{ background:'var(--cs-card)', borderRadius:24, padding:16, boxShadow:'0 1px 4px var(--cs-shadow)', border:'1px solid var(--cs-border-soft)' }}>
          <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:12 }}>
            <div>
              <p style={{ fontSize:10, color:'var(--cs-text-muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.06em', margin:0 }}>{TABS[tab]}</p>
              <p style={{ fontSize:28, fontWeight:900, color:'var(--cs-text)', lineHeight:1.1, margin:'2px 0 0' }}>{label}</p>
            </div>
            <span style={{ fontSize:12, fontWeight:700, color:'var(--cs-accent)', background:'var(--cs-accent-light)', padding:'4px 10px', borderRadius:20 }}>
              {change} vs last 7 days
            </span>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top:5, right:5, bottom:0, left:-20 }}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor={color} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={color} stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--cs-border)" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize:9, fill:'var(--cs-text-muted)' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize:9, fill:'var(--cs-text-muted)' }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2.5} fill="url(#areaGrad)" dot={{ r:3, fill:color, strokeWidth:0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insights (Right side on desktop) */}
        <div style={{ paddingBottom:24 }}>
          <h2 style={{ fontSize:14, fontWeight:700, color:'var(--cs-text)', marginBottom:12 }}>AI Insights</h2>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {INSIGHTS.map(({ icon: Icon, color, bg, title, sub }) => (
              <div key={title} style={{ background:'var(--cs-card)', borderRadius:20, padding:16, boxShadow:'0 1px 4px var(--cs-shadow)', border:'1px solid var(--cs-border-soft)', display:'flex', alignItems:'flex-start', gap:12 }}>
                <div style={{ width:36, height:36, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, background:bg }}>
                  <Icon size={16} strokeWidth={2} style={{ color }} />
                </div>
                <div>
                  <p style={{ fontSize:13, fontWeight:700, color:'var(--cs-text)', lineHeight:1.3, margin:0 }}>{title}</p>
                  <p style={{ fontSize:11, color:'var(--cs-text-muted)', fontWeight:500, margin:'3px 0 0' }}>{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

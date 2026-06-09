import React, { useState } from 'react';
import { ArrowLeft, Save, X, Leaf, TrendingUp } from 'lucide-react';
import farmBanner from '../assets/farm-illustration-banner.png';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { useI18n } from '../I18nContext';

const ndviTrend = [{ v: 0.58 }, { v: 0.62 }, { v: 0.64 }, { v: 0.65 }, { v: 0.66 }];

/* ─── Edit-mode modal sheet ─────────────────────────────────────────────── */
function EditModal({ farmName, setFarmName, location, setLocation, area, setArea, onClose, onSave, saved }) {
  return (
    <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.5)', zIndex:100, display:'flex', alignItems:'flex-end' }}
      onClick={onClose}>
      <div onClick={e => e.stopPropagation()}
        style={{ width:'100%', maxWidth:420, margin:'0 auto', background:'var(--cs-card)', borderRadius:'28px 28px 0 0', padding:'24px 20px 40px', boxShadow:'0 -4px 30px rgba(0,0,0,0.2)' }}>
        <div style={{ width:40, height:4, background:'var(--cs-border)', borderRadius:2, margin:'0 auto 20px' }} />
        <p style={{ fontSize:11, fontWeight:700, color:'var(--cs-accent)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:16 }}>
          Edit Farm Information
        </p>
        {[
          { label:'Farm Name',    val:farmName,  set:setFarmName },
          { label:'Location',     val:location,  set:setLocation },
          { label:'Area (acres)', val:area,      set:setArea     },
        ].map(f => (
          <div key={f.label} style={{ marginBottom:14 }}>
            <label style={{ display:'block', fontSize:10, fontWeight:700, color:'var(--cs-text-sec)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:5 }}>
              {f.label}
            </label>
            <input value={f.val} onChange={e => f.set(e.target.value)}
              style={{ width:'100%', background:'var(--cs-bg)', border:'1.5px solid var(--cs-border)', borderRadius:12, padding:'11px 14px', fontSize:14, color:'var(--cs-text)', outline:'none', boxSizing:'border-box', fontFamily:'inherit' }}
              onFocus={e => e.target.style.borderColor='var(--cs-accent)'}
              onBlur={e  => e.target.style.borderColor='var(--cs-border)'}
            />
          </div>
        ))}
        <div style={{ display:'flex', gap:10, marginTop:8 }}>
          <button onClick={onClose}
            style={{ flex:1, padding:'13px', borderRadius:14, border:'1.5px solid var(--cs-border)', background:'var(--cs-bg)', fontSize:14, fontWeight:700, color:'var(--cs-text-sec)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6, fontFamily:'inherit' }}>
            <X size={15} /> Cancel
          </button>
          <button onClick={onSave}
            style={{ flex:1, padding:'13px', borderRadius:14, border:'none', background: saved ? '#16A34A' : 'var(--cs-accent)', fontSize:14, fontWeight:700, color:'#FFFFFF', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6, transition:'background 0.3s', fontFamily:'inherit' }}>
            <Save size={15} /> {saved ? 'Saved!' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main screen ───────────────────────────────────────────────────────── */
export default function FarmDetailsConfigScreen({ onNavigate }) {
  const { t } = useI18n();
  const [isEditing, setIsEditing] = useState(false);
  const [farmName,  setFarmName]  = useState("Ramesh's Farm");
  const [location,  setLocation]  = useState('Vadodara, Gujarat');
  const [area,      setArea]      = useState('12.4');
  const [saved,     setSaved]     = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => { setSaved(false); setIsEditing(false); }, 1200);
  };

  return (
    <div className="content-max" style={{ display:'flex', flexDirection:'column', minHeight:'100%', background:'var(--cs-bg)' }}>

      {/* ── Header ── */}
      <div style={{ display:'flex', alignItems:'center', gap:14, padding:'20px 20px 12px' }}>
        <button onClick={() => onNavigate('profile')}
          style={{ width:36, height:36, borderRadius:'50%', background:'var(--cs-card)', border:'1px solid var(--cs-border-soft)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0, boxShadow:'0 1px 4px var(--cs-shadow)' }}>
          <ArrowLeft size={17} strokeWidth={2.2} style={{ color:'var(--cs-text)' }} />
        </button>
        <h1 style={{ fontSize:19, fontWeight:900, color:'var(--cs-text)', margin:0 }}>Farm Details</h1>
      </div>

      {/* ── Hero banner — edge-to-edge with rounded bottom ── */}
      <div style={{ margin:'0 16px 20px', borderRadius:22, overflow:'hidden', boxShadow:'0 4px 20px var(--cs-shadow-md)', flexShrink:0 }}>
        <img
          src={farmBanner}
          alt="Farm"
          style={{ width:'100%', height:190, objectFit:'cover', objectPosition:'center 35%', display:'block' }}
        />
      </div>

      {/* ── Farm Overview card ── */}
      <div style={{ margin:'0 16px', background:'var(--cs-card)', borderRadius:24, padding:'18px 18px 20px', boxShadow:'0 2px 12px var(--cs-shadow)', border:'1px solid var(--cs-border-soft)' }}>

        {/* Section heading */}
        <p style={{ fontSize:15, fontWeight:800, color:'var(--cs-text)', margin:'0 0 14px', letterSpacing:'-0.2px' }}>
          Farm Overview
        </p>

        {/* Top row: 3 stat tiles */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginBottom:10 }}>
          {/* Total Fields */}
          <div style={tileStyle}>
            <p style={tileLabelStyle}>Total Fields</p>
            <p style={{ ...tileValueStyle, color:'var(--cs-text)' }}>2</p>
          </div>

          {/* Total Area */}
          <div style={tileStyle}>
            <p style={tileLabelStyle}>Total Area</p>
            <div style={{ display:'flex', alignItems:'flex-end', gap:3 }}>
              <p style={{ ...tileValueStyle, color:'var(--cs-text)', marginBottom:0 }}>{area}</p>
              <p style={{ fontSize:10, color:'var(--cs-text-muted)', fontWeight:600, margin:'0 0 3px', lineHeight:1 }}>acres</p>
            </div>
          </div>

          {/* Active Alerts */}
          <div style={tileStyle}>
            <p style={tileLabelStyle}>Active Alerts</p>
            <p style={{ ...tileValueStyle, color:'var(--cs-danger)' }}>1</p>
          </div>
        </div>

        {/* Bottom row: 2 stat tiles */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          {/* Soil Health */}
          <div style={tileStyle}>
            <p style={tileLabelStyle}>Soil Health</p>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:2 }}>
              <p style={{ fontSize:20, fontWeight:900, color:'var(--cs-text)', margin:0, lineHeight:1 }}>Good</p>
              <Leaf size={16} style={{ color:'var(--cs-accent)' }} />
            </div>
          </div>

          {/* Overall NDVI */}
          <div style={tileStyle}>
            <p style={tileLabelStyle}>Overall NDVI</p>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:2 }}>
              <p style={{ fontSize:20, fontWeight:900, color:'var(--cs-text)', margin:0, lineHeight:1 }}>0.66</p>
              {/* Mini sparkline */}
              <div style={{ flex:1, height:28 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={ndviTrend}>
                    <YAxis domain={['dataMin', 'dataMax']} hide />
                    <Line type="monotone" dataKey="v" stroke="var(--cs-accent)" strokeWidth={2.2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Spacer ── */}
      <div style={{ flex:1 }} />

      {/* ── Bottom button ── */}
      <div style={{ padding:'16px 16px 28px' }}>
        <button
          onClick={() => setIsEditing(true)}
          style={{
            width:'100%', background:'var(--cs-accent)', color:'#FFFFFF',
            fontWeight:800, fontSize:15, padding:'16px',
            borderRadius:18, border:'none', cursor:'pointer',
            boxShadow:'0 4px 18px rgba(74,124,89,0.35)',
            fontFamily:'inherit', letterSpacing:'0.1px',
            transition:'opacity 0.2s',
          }}
        >
          Edit Farm Details
        </button>
      </div>

      {/* ── Edit modal ── */}
      {isEditing && (
        <EditModal
          farmName={farmName} setFarmName={setFarmName}
          location={location} setLocation={setLocation}
          area={area}         setArea={setArea}
          onClose={() => setIsEditing(false)}
          onSave={handleSave}
          saved={saved}
        />
      )}
    </div>
  );
}

/* ─── Shared tile styles ─────────────────────────────────────────────────── */
const tileStyle = {
  background:'var(--cs-bg)',
  borderRadius:16,
  padding:'12px 14px',
  border:'1px solid var(--cs-border-soft)',
};

const tileLabelStyle = {
  fontSize:10, fontWeight:700, color:'var(--cs-text-muted)',
  textTransform:'uppercase', letterSpacing:'0.05em',
  margin:'0 0 4px', lineHeight:1.3,
};

const tileValueStyle = {
  fontSize:22, fontWeight:900, margin:0, lineHeight:1,
};

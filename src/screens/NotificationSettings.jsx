import React, { useState } from 'react';
import { useI18n } from '../I18nContext';

import { ArrowLeft, Bell, Smartphone, Mail, Volume2 } from 'lucide-react';

function Toggle({ value, onChange }) {
  return (
    <div onClick={() => onChange(!value)}
      style={{
        width:44, height:24, borderRadius:12, cursor:'pointer',
        background: value ? '#4A7C59' : '#D4D0C8',
        position:'relative', transition:'background 0.25s', flexShrink:0,
      }}>
      <div style={{
        position:'absolute', top:3, left: value ? 23 : 3,
        width:18, height:18, borderRadius:'50%', background:'var(--cs-card)',
        boxShadow:'0 1px 4px rgba(0,0,0,0.2)', transition:'left 0.25s',
      }} />
    </div>
  );
}

export default function NotificationSettings({ onNavigate }) {
  const { t } = useI18n();
  const [prefs, setPrefs] = useState({
    push:    true,
    email:   false,
    sms:     true,
    drought: true,
    pest:    true,
    weather: true,
    ndvi:    false,
    market:  false,
  });

  const toggle = (key) => setPrefs(p => ({ ...p, [key]: !p[key] }));

  const Section = ({ title, icon: Icon, items }) => (
    <div style={{ marginBottom:20 }}>
      <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:8 }}>
        <Icon size={13} style={{ color:'var(--cs-accent)' }} />
        <p style={{ fontSize:11, fontWeight:700, color:'var(--cs-accent)', textTransform:'uppercase', letterSpacing:'0.07em', margin:0 }}>{title}</p>
      </div>
      <div style={{ background:'var(--cs-card)', borderRadius:24, overflow:'hidden', border:'1px solid var(--cs-border-soft)', boxShadow:'0 1px 4px var(--cs-shadow)' }}>
        {items.map(({ key, label, sub }, i) => (
          <div key={key} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px', borderBottom: i < items.length-1 ? '1px solid var(--cs-bg)' : 'none' }}>
            <div>
              <p style={{ fontSize:14, fontWeight:600, color:'var(--cs-text)', margin:0 }}>{label}</p>
              {sub && <p style={{ fontSize:11, color:'var(--cs-text-muted)', margin:'2px 0 0' }}>{sub}</p>}
            </div>
            <Toggle value={prefs[key]} onChange={() => toggle(key)} />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="content-max" style={{ display:'flex', flexDirection:'column', minHeight:'100%', background:'var(--cs-bg)' }}>
      <div style={{ padding:'24px 20px 16px', display:'flex', alignItems:'center', gap:12 }}>
        <button onClick={() => onNavigate('profile')}
          style={{ width:34, height:34, borderRadius:'50%', background:'var(--cs-card)', border:'1px solid var(--cs-border-soft)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', boxShadow:'0 1px 4px var(--cs-shadow-md)' }}>
          <ArrowLeft size={16} strokeWidth={2} style={{ color:'var(--cs-text)' }} />
        </button>
        <h1 style={{ fontSize:18, fontWeight:900, color:'var(--cs-text)', margin:0 }}>Notification Settings</h1>
      </div>

      <div style={{ padding:'0 20px 32px' }}>
        <Section title="Channels" icon={Bell} items={[
          { key:'push',  label:'Push Notifications', sub:'Alerts on your device' },
          { key:'email', label:'Email Alerts',        sub:'Sent to ramesh@example.com' },
          { key:'sms',   label:'SMS Alerts',          sub:'Sent to +91 98765 43210' },
        ]} />
        <Section title="Alert Types" icon={Volume2} items={[
          { key:'drought', label:'Drought Risk Alerts',   sub:'Soil moisture warnings' },
          { key:'pest',    label:'Pest & Disease Alerts', sub:'Early detection reports' },
          { key:'weather', label:'Weather Warnings',      sub:'Extreme weather events' },
          { key:'ndvi',    label:'NDVI Updates',          sub:'Weekly health summaries' },
          { key:'market',  label:'Market Price Alerts',   sub:'Mandi price changes' },
        ]} />
      </div>
    </div>
  );
}

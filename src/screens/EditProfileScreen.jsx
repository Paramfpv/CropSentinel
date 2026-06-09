import React, { useState } from 'react';
import { useI18n } from '../I18nContext';

import { ArrowLeft, User, Mail, Phone, MapPin, Save } from 'lucide-react';
import farmerAvatar from '../assets/farmer-avatar.png';

export default function EditProfileScreen({ onNavigate }) {
  const { t } = useI18n();
  const [name,  setName]  = useState('Ramesh Kumar');
  const [email, setEmail] = useState('ramesh@example.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [location, setLocation] = useState('Vadodara, Gujarat');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => { setSaved(false); onNavigate('profile'); }, 1200);
  };

  return (
    <div className="content-max" style={{ display:'flex', flexDirection:'column', minHeight:'100%', background:'var(--cs-bg)' }}>
      {/* Header */}
      <div style={{ padding:'24px 20px 16px', display:'flex', alignItems:'center', gap:12 }}>
        <button onClick={() => onNavigate('profile')}
          style={{ width:34, height:34, borderRadius:'50%', background:'var(--cs-card)', border:'1px solid var(--cs-border-soft)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', boxShadow:'0 1px 4px var(--cs-shadow-md)' }}>
          <ArrowLeft size={16} strokeWidth={2} style={{ color:'var(--cs-text)' }} />
        </button>
        <h1 style={{ fontSize:18, fontWeight:900, color:'var(--cs-text)', margin:0 }}>Edit Profile</h1>
      </div>

      {/* Avatar */}
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'8px 0 24px', gap:8 }}>
        <div style={{ width:80, height:80, borderRadius:24, overflow:'hidden', border:'3px solid var(--cs-border)' }}>
          <img src={farmerAvatar} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top' }} />
        </div>
        <span style={{ fontSize:12, fontWeight:700, color:'var(--cs-accent)', cursor:'pointer' }}>Change Photo</span>
      </div>

      {/* Form fields */}
      <div style={{ padding:'0 20px', display:'flex', flexDirection:'column', gap:14 }}>
        {[
          { label:'Full Name',    icon:User,    value:name,     set:setName,     type:'text' },
          { label:'Email',        icon:Mail,    value:email,    set:setEmail,    type:'email' },
          { label:'Phone Number', icon:Phone,   value:phone,    set:setPhone,    type:'tel' },
          { label:'Location',     icon:MapPin,  value:location, set:setLocation, type:'text' },
        ].map(({ label, icon:Icon, value, set, type }) => (
          <div key={label}>
            <label style={{ display:'block', fontSize:10, fontWeight:700, color:'var(--cs-text-sec)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:6 }}>{label}</label>
            <div style={{ position:'relative' }}>
              <Icon size={14} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'var(--cs-text-muted)' }} />
              <input type={type} value={value} onChange={e => set(e.target.value)}
                style={{ width:'100%', background:'var(--cs-card)', border:'1.5px solid var(--cs-border)', borderRadius:16, paddingLeft:38, paddingRight:16, paddingTop:13, paddingBottom:13, fontSize:14, color:'var(--cs-text)', outline:'none', boxSizing:'border-box', fontFamily:'inherit' }}
                onFocus={e => e.target.style.borderColor='#4A7C59'}
                onBlur={e => e.target.style.borderColor='#E8E4D8'}
              />
            </div>
          </div>
        ))}

        <button onClick={handleSave}
          style={{ marginTop:8, width:'100%', background: saved ? '#16A34A' : '#4A7C59', color:'white', fontWeight:700, fontSize:15, padding:'15px', borderRadius:16, border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, transition:'background 0.3s' }}>
          <Save size={16} />
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

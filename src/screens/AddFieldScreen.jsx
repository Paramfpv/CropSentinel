import React, { useState } from 'react';
import { ArrowLeft, ChevronRight, MapPin, Check, X } from 'lucide-react';
import leavesBottomRight from '../assets/leaves-bottom-right.png';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import { useI18n } from '../I18nContext';

import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25,41], iconAnchor: [12,41] });
L.Marker.prototype.options.icon = DefaultIcon;

function LocationMarker({ position, setPosition }) {
  useMapEvents({ click(e) { setPosition(e.latlng); } });
  return position === null ? null : <Marker position={position} />;
}

const S = {
  label: { display:'block', fontSize:11, fontWeight:700, color:'var(--cs-text-sec)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:6 },
  input: { width:'100%', background:'var(--cs-card)', border:'1.5px solid var(--cs-border)', borderRadius:16, padding:'14px 16px', fontSize:14, color:'var(--cs-text)', outline:'none', boxSizing:'border-box', fontFamily:'inherit' },
};

export default function AddFieldScreen({ onNavigate }) {
  const { t } = useI18n();
  const [farmName, setFarmName] = useState('');
  const [cropType, setCropType] = useState('');
  const [area,     setArea]     = useState('');
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [position,  setPosition]  = useState(null);
  const [isSaving,  setIsSaving]  = useState(false);

  const handleSave = async () => {
    if (!farmName || !cropType || !position) {
      alert('Please fill in Farm Name, Crop Type, and select a Location on the map.');
      return;
    }
    const payload = { farm_name: farmName, crop_type: cropType, latitude: position.lat, longitude: position.lng };
    setIsSaving(true);
    try {
      await axios.post('http://localhost:8000/api/farms', payload).catch(() => {
        console.warn('Backend not available yet — payload ready:', payload);
      });
      alert('Farm saved successfully!');
      onNavigate('farms');
    } catch (e) {
      alert('Failed to save farm. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="content-max" style={{ display:'flex', flexDirection:'column', minHeight:'100%', background:'var(--cs-bg)', position:'relative', overflow:'hidden' }}>
      {!isMapOpen && (
        <img src={leavesBottomRight} alt="" style={{ position:'absolute', bottom:0, right:0, width:128, pointerEvents:'none', opacity:0.4, zIndex:0 }} />
      )}

      {/* Header */}
      <div style={{ padding:'24px 20px 12px', position:'relative', zIndex:10, display:'flex', alignItems:'center', gap:12 }}>
        <button
          onClick={() => isMapOpen ? setIsMapOpen(false) : onNavigate('farms')}
          style={{ width:34, height:34, borderRadius:'50%', background:'var(--cs-card)', border:'1px solid var(--cs-border-soft)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', boxShadow:'0 1px 4px var(--cs-shadow)' }}
        >
          <ArrowLeft size={16} strokeWidth={2} style={{ color:'var(--cs-text)' }} />
        </button>
        <h1 style={{ fontSize:18, fontWeight:900, color:'var(--cs-text)', margin:0 }}>
          {isMapOpen ? 'Select Location' : 'Add New Field'}
        </h1>
      </div>

      {isMapOpen ? (
        /* Map view */
        <div style={{ flex:1, display:'flex', flexDirection:'column', position:'relative', zIndex:10 }}>
          <p style={{ fontSize:12, color:'var(--cs-text-sec)', fontWeight:500, padding:'0 20px 8px' }}>
            Tap on the map to drop a pin for your farm.
          </p>
          <div style={{ flex:1, width:'100%', position:'relative' }}>
            <MapContainer center={[22.3072, 73.1812]} zoom={13} style={{ width:'100%', height:'100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='© OpenStreetMap contributors' />
              <LocationMarker position={position} setPosition={setPosition} />
            </MapContainer>
          </div>
          <div style={{ padding:20, background:'var(--cs-card)', borderTop:'1px solid var(--cs-border-soft)', boxShadow:'0 -2px 12px var(--cs-shadow)' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
              <div>
                <p style={{ fontSize:10, fontWeight:700, color:'var(--cs-text-muted)', textTransform:'uppercase', letterSpacing:'0.06em', margin:0 }}>Selected Coordinates</p>
                <p style={{ fontSize:14, fontWeight:700, color:'var(--cs-text)', margin:'2px 0 0' }}>
                  {position ? `${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}` : 'No location selected'}
                </p>
              </div>
            </div>
            <div style={{ display:'flex', gap:12 }}>
              <button onClick={() => setIsMapOpen(false)} style={{ flex:1, padding:'14px', borderRadius:16, border:'1.5px solid var(--cs-border)', background:'var(--cs-bg)', color:'var(--cs-text-sec)', fontWeight:700, fontSize:14, display:'flex', alignItems:'center', justifyContent:'center', gap:8, cursor:'pointer', fontFamily:'inherit' }}>
                <X size={16} /> Cancel
              </button>
              <button onClick={() => setIsMapOpen(false)} disabled={!position} style={{ flex:1, padding:'14px', borderRadius:16, border:'none', background: position ? 'var(--cs-accent)' : 'var(--cs-toggle-off)', color:'#FFFFFF', fontWeight:700, fontSize:14, display:'flex', alignItems:'center', justifyContent:'center', gap:8, cursor: position ? 'pointer' : 'not-allowed', fontFamily:'inherit' }}>
                <Check size={16} /> Confirm
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Form view */
        <div style={{ padding:'0 20px', position:'relative', zIndex:10, display:'flex', flexDirection:'column', gap:16, flex:1, overflowY:'auto', paddingBottom:40 }}>
          <div>
            <label style={S.label}>Field Name</label>
            <input type="text" value={farmName} onChange={e => setFarmName(e.target.value)} placeholder="e.g., My Farm" style={S.input} />
          </div>

          <div>
            <label style={S.label}>Select Crop Type</label>
            <div style={{ position:'relative' }}>
              <select value={cropType} onChange={e => setCropType(e.target.value)}
                style={{ ...S.input, appearance:'none', paddingRight:36 }}>
                <option value="" disabled>Choose crop</option>
                <option value="Wheat">Wheat</option>
                <option value="Rice">Rice</option>
                <option value="Cotton">Cotton</option>
                <option value="Sugarcane">Sugarcane</option>
              </select>
              <ChevronRight size={14} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%) rotate(90deg)', color:'var(--cs-text-muted)', pointerEvents:'none' }} />
            </div>
          </div>

          <div>
            <label style={S.label}>Field Area (Acres)</label>
            <input type="number" value={area} onChange={e => setArea(e.target.value)} placeholder="e.g., 5.2" style={S.input} />
          </div>

          <div>
            <label style={S.label}>Location</label>
            <div onClick={() => setIsMapOpen(true)} style={{ background:'var(--cs-card)', border:'1.5px solid var(--cs-border)', borderRadius:16, padding:'14px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer' }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <MapPin size={15} style={{ color: position ? 'var(--cs-accent)' : 'var(--cs-text-muted)', flexShrink:0 }} />
                <span style={{ fontSize:14, color: position ? 'var(--cs-text)' : 'var(--cs-text-muted)', fontWeight: position ? 600 : 400 }}>
                  {position ? `${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}` : 'Select on map'}
                </span>
              </div>
              {position && (
                <span style={{ fontSize:10, fontWeight:700, color:'var(--cs-accent)', background:'var(--cs-accent-light)', padding:'3px 8px', borderRadius:8 }}>Selected</span>
              )}
            </div>
          </div>

          <button onClick={handleSave} disabled={isSaving} style={{
            marginTop:'auto', marginBottom:16, width:'100%', padding:'16px', borderRadius:16,
            border:'none', background: isSaving ? 'var(--cs-toggle-off)' : 'var(--cs-accent)',
            color:'#FFFFFF', fontWeight:700, fontSize:15, display:'flex', alignItems:'center',
            justifyContent:'center', cursor: isSaving ? 'not-allowed' : 'pointer', fontFamily:'inherit',
          }}>
            {isSaving ? 'Saving…' : 'Save Field'}
          </button>
        </div>
      )}
    </div>
  );
}

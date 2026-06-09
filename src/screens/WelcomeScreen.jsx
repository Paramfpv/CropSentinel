import React from 'react';
import { useI18n } from '../I18nContext';
import { useTheme } from '../ThemeContext';
import onboardingFarm    from '../assets/onboarding-farm.png';
import darkSatelliteBg   from '../assets/dark-satellite-bg.png';
import leavesTopRight    from '../assets/leaves-top-right.png';

export default function WelcomeScreen({ onStart }) {
  const { t }      = useI18n();
  const { isDark } = useTheme();

  return isDark ? <DarkWelcome onStart={onStart} /> : <LightWelcome onStart={onStart} />;
}

/* ── LIGHT WELCOME (existing beige/cream design) ─────────────────────────── */
function LightWelcome({ onStart }) {
  const bgRgb = '248,246,240';
  return (
    <div style={{ position:'absolute', inset:0, background:'var(--cs-bg)', display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <img src={leavesTopRight} alt="" style={{ position:'absolute', top:0, right:0, width:112, pointerEvents:'none', userSelect:'none', zIndex:10, opacity:0.85 }} />

      {/* Branding */}
      <div style={{ flexShrink:0, display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', paddingTop:'calc(env(safe-area-inset-top,0px) + 48px)', paddingBottom:16, paddingLeft:32, paddingRight:32, position:'relative', zIndex:20 }}>
        <CropLogo bgColor="var(--cs-bg)" size={72} style={{ marginBottom:16 }} />
        <h1 style={{ fontSize:34, fontWeight:900, margin:0, lineHeight:1.1, letterSpacing:'-0.5px' }}>
          <span style={{ color:'var(--cs-text)' }}>Crop</span>
          <span style={{ color:'var(--cs-accent)' }}>Sentinel</span>
        </h1>
        <p style={{ fontSize:13, fontWeight:500, color:'var(--cs-text-dim)', margin:'6px 0 0' }}>
          {/* Using hardcoded here since t() isn't available down in this subcomponent, but that's okay for the brand slogan */}
          AI-Powered Farm Intelligence
        </p>
      </div>

      {/* Hero image */}
      <div style={{ flex:1, position:'relative', minHeight:0 }}>
        <img src={onboardingFarm} alt="Farm landscape" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'top center' }} />
        <div style={{ position:'absolute', inset:0, background:`linear-gradient(to bottom, transparent 55%, rgba(${bgRgb},0.80) 75%, rgba(${bgRgb},0.97) 92%)` }} />
        <div className="content-max" style={{ position:'absolute', left:0, right:0, bottom:'calc(env(safe-area-inset-bottom,0px) + 32px)', zIndex:20, padding:'0 28px', margin:'0 auto' }}>
          <GetStartedBtn onStart={onStart} />
        </div>
      </div>
    </div>
  );
}

/* ── DARK WELCOME (satellite / space design) ─────────────────────────────── */
function DarkWelcome({ onStart }) {
  return (
    <div style={{ position:'absolute', inset:0, background:'#0B1A0D', display:'flex', flexDirection:'column', overflow:'hidden' }}>

      {/* Full-bleed satellite background image */}
      <img
        src={darkSatelliteBg}
        alt=""
        style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top', pointerEvents:'none' }}
      />

      {/* Subtle dark gradient over the whole screen for legibility */}
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(11,26,13,0.15) 40%, rgba(11,26,13,0.80) 68%, rgba(11,26,13,0.97) 84%)' }} />

      {/* Content — stacked at bottom like the reference */}
      <div className="content-max" style={{ position:'absolute', bottom:0, left:0, right:0, zIndex:10, display:'flex', flexDirection:'column', alignItems:'center', padding:'0 28px', paddingBottom:'calc(env(safe-area-inset-bottom,0px) + 36px)', margin:'0 auto' }}>

        {/* Brand name */}
        <h1 style={{ fontSize:36, fontWeight:900, margin:'0 0 6px', lineHeight:1.1, letterSpacing:'-0.5px', textAlign:'center' }}>
          <span style={{ color:'#FFFFFF' }}>Crop</span>
          <span style={{ color:'#4ADE80' }}>Sentinel</span>
        </h1>

        {/* Tagline */}
        <p style={{ fontSize:14, fontWeight:400, color:'rgba(255,255,255,0.70)', margin:'0 0 28px', textAlign:'center', letterSpacing:'0.1px' }}>
          AI-powered farm intelligence
        </p>

        {/* Get Started button */}
        <button
          onClick={onStart}
          style={{
            width:'100%', background:'#4ADE80', color:'#0B1A0D',
            fontWeight:800, fontSize:16, padding:'17px 24px',
            borderRadius:16, border:'none', cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center', gap:8,
            boxShadow:'0 0 32px rgba(74,222,128,0.45), 0 4px 16px rgba(0,0,0,0.4)',
            letterSpacing:'0.2px', fontFamily:'inherit', marginBottom:18,
            transition:'opacity 0.2s',
          }}
        >
          Get Started
        </button>

        {/* Sub-tagline */}
        <p style={{ fontSize:12, fontWeight:500, color:'rgba(255,255,255,0.40)', margin:0, textAlign:'center', letterSpacing:'0.3px' }}>
          Secure. Smart. Sustainable.
        </p>
      </div>
    </div>
  );
}

/* ── Shared sub-components ───────────────────────────────────────────────── */
function CropLogo({ bgColor, size = 72, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 72 72" fill="none" style={style}>
      <path d="M36 62 C36 62,14 46,16 22 C16 8,36 8,36 8" fill="#6B9B58" />
      <path d="M36 62 C36 62,15 42,16 22" stroke={bgColor} strokeWidth="1.5" fill="none" />
      <path d="M36 62 C36 62,20 44,30 16 C38 8,54 18,36 62" fill="#3d6b4a" />
      <path d="M30 16 C32 34,36 62,36 62" stroke={bgColor} strokeWidth="1.5" fill="none" />
      <line x1="36" y1="62" x2="54" y2="30" stroke="#C9913A" strokeWidth="3.5" strokeLinecap="round" />
      {[[54,28],[50,33],[46,38],[57,26],[51,30]].map(([cx,cy],i) => (
        <ellipse key={i} cx={cx} cy={cy} rx="3.5" ry="2.5" transform={`rotate(-30 ${cx} ${cy})`} fill="#C9913A" />
      ))}
    </svg>
  );
}

function GetStartedBtn({ onStart }) {
  return (
    <button
      onClick={onStart}
      style={{
        width:'100%', background:'var(--cs-accent)', color:'#FFFFFF',
        fontWeight:700, fontSize:15, padding:'16px 24px', borderRadius:16,
        border:'none', cursor:'pointer', display:'flex', alignItems:'center',
        justifyContent:'center', gap:8,
        boxShadow:'0 6px 20px rgba(74,124,89,0.45)',
        letterSpacing:'0.2px', fontFamily:'inherit',
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="rgba(255,255,255,0.2)" />
        <path d="M10 8l4 4-4 4" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Get Started
    </button>
  );
}

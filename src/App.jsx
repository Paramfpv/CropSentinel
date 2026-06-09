import React, { useState } from 'react';
import { Home, Sprout, TrendingUp, Bell, User } from 'lucide-react';

import { I18nProvider, useI18n } from './I18nContext';
import { ThemeProvider } from './ThemeContext';

import WelcomeScreen          from './screens/WelcomeScreen';
import LoginScreen             from './screens/LoginScreen';
import HomeScreen              from './screens/HomeScreen';
import FarmsListScreen         from './screens/FarmsListScreen';
import FarmsScreen             from './screens/FarmsScreen';
import InterventionScreen      from './screens/InterventionScreen';
import InsightsScreen          from './screens/InsightsScreen';
import AlertsScreen            from './screens/AlertsScreen';
import ProfileScreen           from './screens/ProfileScreen';
import AddFieldScreen          from './screens/AddFieldScreen';
import SettingsScreen          from './screens/SettingsScreen';
import NotificationSettings    from './screens/NotificationSettings';
import HelpSupportScreen       from './screens/HelpSupportScreen';
import AboutScreen             from './screens/AboutScreen';
import FarmDetailsConfigScreen from './screens/FarmDetailsConfigScreen';
import EditProfileScreen       from './screens/EditProfileScreen';

const BOTTOM_NAV_SCREENS = ['home','farms','insights','alerts','profile'];

function AppNavigation() {
  const { t } = useI18n();
  const [phase, setPhase]   = useState('welcome'); // welcome | login | app
  const [screen, setScreen] = useState('home');

  const navigate = (to) => {
    if (to === 'welcome') { setPhase('welcome'); setScreen('home'); return; }
    setScreen(to);
  };

  const NAV_ITEMS = [
    { key: 'home',     Icon: Home,       label: t('home')     },
    { key: 'farms',    Icon: Sprout,     label: t('farms')    },
    { key: 'insights', Icon: TrendingUp, label: t('insights') },
    { key: 'alerts',   Icon: Bell,       label: t('alerts'),  badge: true },
    { key: 'profile',  Icon: User,       label: t('profile')  },
  ];

  const renderScreen = () => {
    if (phase === 'welcome') return <WelcomeScreen onStart={() => setPhase('login')} />;
    if (phase === 'login')   return <LoginScreen   onLogin={() => setPhase('app')}  />;

    switch (screen) {
      case 'home':               return <HomeScreen             onNavigate={navigate} />;
      case 'farms':              return <FarmsListScreen         onNavigate={navigate} />;
      case 'farm_detail':        return <FarmsScreen             onNavigate={navigate} />;
      case 'intervention':       return <InterventionScreen      onNavigate={navigate} />;
      case 'insights':           return <InsightsScreen          onNavigate={navigate} />;
      case 'alerts':             return <AlertsScreen            onNavigate={navigate} />;
      case 'profile':            return <ProfileScreen           onNavigate={navigate} />;
      case 'edit_profile':       return <EditProfileScreen       onNavigate={navigate} />;
      case 'add_field':          return <AddFieldScreen          onNavigate={navigate} />;
      case 'settings':           return <SettingsScreen          onNavigate={navigate} />;
      case 'notification_settings': return <NotificationSettings onNavigate={navigate} />;
      case 'help_support':       return <HelpSupportScreen       onNavigate={navigate} />;
      case 'about':              return <AboutScreen             onNavigate={navigate} />;
      case 'farm_details_config':return <FarmDetailsConfigScreen onNavigate={navigate} />;
      default:                   return <HomeScreen             onNavigate={navigate} />;
    }
  };

  const showNav = phase === 'app' && BOTTOM_NAV_SCREENS.includes(screen);

  return (
    <div className="app-container">
      {/* 
        Note: We use flex-direction: row-reverse in CSS for desktop, 
        so rendering <main> then <nav> means <nav> appears on the left on desktop! 
      */}
      <main className="app-main" style={{ paddingTop: phase === 'app' ? 'var(--safe-top)' : 0 }}>
        {renderScreen()}
      </main>

      {showNav && (
        <nav className="app-nav">
          {NAV_ITEMS.map(({ key, Icon, label, badge }) => {
            const active = screen === key;
            return (
              <button key={key} onClick={() => navigate(key)} className={`nav-item ${active ? 'active' : ''}`}>
                <div style={{ position:'relative' }}>
                  <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                  {badge && <span style={{ position:'absolute', top:-4, right:-4, width:8, height:8, background:'var(--cs-danger)', borderRadius:'50%', border:'2px solid var(--cs-card)' }} />}
                </div>
                <span>{label}</span>
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <AppNavigation />
      </I18nProvider>
    </ThemeProvider>
  );
}

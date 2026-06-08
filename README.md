# CropSentinel Mobile 📱
### React Native App | FAR AWAY Hackathon 2026
Built by Yesh | Branch: yesh/mobile

## What I Built
Mobile app for CropSentinel — gives farmers real-time farm health alerts, 
satellite field views, AI intervention recommendations and mandi price trends.

## Tech Stack
- React Native + Expo
- React Navigation (stack + bottom tabs)
- Material 3 Design System
- Victory Native (NDVI + market price charts)
- react-native-maps (satellite farm view)
- Expo Notifications (push alerts on stress detection)
- Reanimated 2 (smooth transitions)

## Screens
| Screen | What it does |
|--------|-------------|
| Onboarding | App intro with Get Started |
| Login | Email + password login |
| My Farms | Farm list with health scores and weather |
| Farm Detail | Satellite map, NDVI score, zone type |
| Alerts Feed | Live intervention alerts sorted by time |
| Intervention Detail | Full AI recommendation with cost and ROI |
| Settings | Notifications, language toggle, demo mode |

## Running Locally
```bash
npm install
npx expo start
```
Scan QR with Expo Go on Android or iOS.

## Folder Structure

src/
├── screens/
│   ├── OnboardingScreen.js
│   ├── LoginScreen.js
│   ├── MyFarmsScreen.js
│   ├── FarmDetailScreen.js
│   ├── AlertsFeedScreen.js
│   ├── InterventionDetailScreen.js
│   └── SettingsScreen.js
├── constants/
│   └── mockData.js
├── hooks/
│   └── useFarms.js
└── theme.js

## API Endpoints Consumed
| Endpoint | Used in |
|----------|---------|
| GET /api/farms | My Farms screen |
| GET /api/ndvi/{farm_id} | Farm Detail screen |
| GET /api/intervention/{farm_id} | Intervention Detail screen |
| GET /api/market/{farm_id} | Intervention Detail chart |

## Day by Day Progress
- D1: Navigation, all screens, mock data, Material 3 theme
- D2: Satellite map with farm polygon [COMPLETE]
  - Farm boundary visualization (rotated diamond viewport overlay)
  - Satellite analysis view (high-resolution premium field card layout)
  - Enhanced Farm Detail screen (integrated dynamic stats: NDVI, Moisture, Risk, Last Updated)
  - Navigation audit completed (fully operational tab/stack connections)
  - Asset integration completed (custom agritech leaf and crop elements loaded)
- D3: Alerts feed, intervention detail with live API
- D4: Victory Native charts, push notifications
- D5: Demo mode, animations, polish
- D6: EAS build APK, submission

## Environment
Create a .env file:
EXPO_PUBLIC_API_URL=http://localhost:8000

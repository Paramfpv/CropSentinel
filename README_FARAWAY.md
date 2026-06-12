# Faraway - Farm Management App

A React Native application for managing farms, monitoring alerts, and tracking interventions with a clean dark green theme.

## Features

- **Onboarding Flow**: Initial app introduction screen
- **Authentication**: Login screen with email and password
- **Farm Management**: View and browse your farms
- **Farm Details**: Detailed information about individual farms including location, crops, and soil health
- **Alerts Feed**: Real-time farm alerts and notifications
- **Intervention Details**: Detailed actions needed for farm alerts
- **Settings**: User preferences and account settings
- **Navigation**: Stack-based navigation with no headers

## Tech Stack

- **React Native** with Expo
- **@react-navigation/native** - Core navigation library
- **@react-navigation/native-stack** - Stack navigator
- **Dark Green Theme** - Custom color scheme optimized for farm apps

## Project Structure

```
Faraway/
├── App.js                          # Main app entry point with navigation setup
├── app.json                        # Expo configuration
├── babel.config.js                # Babel configuration
├── package.json                    # Project dependencies
├── README.md                       # This file
├── src/
│   ├── theme.js                   # Dark green theme configuration
│   └── screens/
│       ├── OnboardingScreen.js    # Welcome/onboarding screen
│       ├── LoginScreen.js         # Login authentication screen
│       ├── MyFarmsScreen.js       # List of user farms
│       ├── FarmDetailScreen.js    # Individual farm details
│       ├── AlertsFeedScreen.js    # Feed of farm alerts
│       ├── InterventionDetailScreen.js # Action details for alerts
│       └── SettingsScreen.js      # User settings and preferences
└── assets/                        # App assets (created by Expo)
```

## Color Palette

The app uses a carefully selected dark green theme:

- **Primary**: `#1B5E20` (Dark Green)
- **Primary Light**: `#2E7D32` (Lighter Dark Green)
- **Primary Dark**: `#0D3817` (Very Dark Green)
- **Secondary**: `#558B2F` (Medium Green)
- **Background**: `#121212` (Very Dark)
- **Surface**: `#1E1E1E` (Dark Surface)
- **Text**: `#FFFFFF` (White)
- **Text Secondary**: `#B0B0B0` (Gray)

## Navigation Stack

The app uses a stack navigator with the following screens:

1. **Onboarding** (Initial Route) → Login
2. **Login** → MyFarms
3. **MyFarms** (Main Hub)
   - → FarmDetail
   - → AlertsFeed
   - → Settings
4. **FarmDetail** → AlertsFeed
5. **AlertsFeed** → InterventionDetail
6. **InterventionDetail**
7. **Settings**

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (optional, but recommended)

### Installation

1. Clone the repository
```bash
cd Faraway
```

2. Install dependencies
```bash
npm install
```

3. Start the Expo development server
```bash
npm start
```

4. Run on your device or emulator:
   - **iOS**: Press `i` in the terminal
   - **Android**: Press `a` in the terminal
   - **Web**: Press `w` in the terminal

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android emulator/device
- `npm run ios` - Run on iOS emulator/device
- `npm run web` - Run on web browser

## Theme Customization

All theme values are centralized in `src/theme.js`. To customize:

```javascript
export const darkGreenTheme = {
  colors: {
    primary: '#1B5E20',  // Modify colors here
    // ... other colors
  },
  spacing: {
    xs: 4,
    // ... other spacing values
  },
  // ... other theme properties
};
```

## Screen Details

### Onboarding Screen
- Welcome message
- "Get Started" button to proceed to login

### Login Screen
- Email and password input fields
- Sign In button
- Basic form validation ready for implementation

### MyFarms Screen
- List of user's farms
- Farm cards showing name, crops, and area
- "View Alerts" button for quick access
- Settings icon in header

### FarmDetail Screen
- Comprehensive farm information
- Location, area size, crops, soil health, water level
- Back navigation
- Link to farm-specific alerts

### AlertsFeed Screen
- List of all farm alerts with severity indicators
- Timestamps and descriptions
- Color-coded severity (error, warning, success)
- Navigation to intervention details

### InterventionDetail Screen
- Complete alert details and recommended actions
- Affected area and estimated costs
- Time to resolve information
- "Take Action" and "Dismiss" buttons

### Settings Screen
- Toggle notifications and dark mode
- Edit profile and password options
- App version and legal information
- Logout functionality

## Notes

- All screens use the dark green theme for consistency
- Headers are hidden throughout the app (except status bar)
- Back navigation is implemented manually with custom buttons
- Mock data is used for demonstration purposes
- The app is optimized for both iOS and Android

## Future Enhancements

- Real API integration
- User authentication
- Push notifications
- Real-time farm data updates
- Offline support
- Map integration for farm locations
- Photo capture for farm monitoring

## License

This project is licensed under the MIT License.

## Support

For issues or questions, please create an issue in the project repository.

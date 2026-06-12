# Quick Start Guide - Faraway App

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+) and npm installed
- Expo CLI: `npm install -g expo-cli`
- An iOS simulator or Android emulator OR a physical device with Expo Go app

### Installation Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Development Server**
   ```bash
   npm start
   ```

3. **Run the App**
   - **iOS Simulator**: Press `i`
   - **Android Emulator**: Press `a`
   - **Web Browser**: Press `w`
   - **Physical Device**: Scan QR code with Expo Go app

## 📁 Project Structure Overview

- **`App.js`** - Main navigation setup with stack navigator
- **`src/theme.js`** - Centralized dark green theme
- **`src/screens/`** - All screen components
- **`app.json`** - Expo configuration
- **`package.json`** - Dependencies

## 🎨 Color Theme

All colors are defined in `src/theme.js`:
- Primary Green: `#1B5E20`
- Dark Background: `#121212`
- Surface: `#1E1E1E`

## 📱 Screen Navigation Flow

```
Onboarding
    ↓
Login
    ↓
MyFarms (Hub)
    ├→ FarmDetail
    ├→ AlertsFeed
    │   └→ InterventionDetail
    └→ Settings
```

## 🔧 Development Tips

1. **Hot Reload**: The app automatically reloads when you save files
2. **Debug**: Open the Expo dev menu (shake device or Ctrl+M on Android)
3. **Console Logs**: Visible in the terminal running `npm start`

## 📦 Key Dependencies

- `react-native`: Native app framework
- `@react-navigation/native`: Navigation foundation
- `@react-navigation/native-stack`: Stack navigator
- `react-native-screens`: Performance optimization
- `expo-status-bar`: Status bar control

## ✨ Features Implemented

✅ Stack navigator with 7 screens
✅ No headers throughout app
✅ Dark green theme on all screens
✅ Onboarding as initial route
✅ Mock data for farms, alerts, and interventions
✅ Navigation between all screens
✅ Custom back buttons and navigation

## 🚧 Next Steps for Development

1. Connect to real API endpoints
2. Implement user authentication
3. Add real farm/alert data
4. Implement state management (Redux/Context API)
5. Add form validation and submission
6. Implement offline support
7. Add app icons and splash screen

## 🐛 Troubleshooting

**Metro Bundler Issues**
```bash
npm start -- --reset-cache
```

**Module Not Found**
```bash
npm install
```

**Port 8081 Already in Use**
```bash
npm start -- -p 8082
```

## 📚 Resources

- [React Native Docs](https://reactnative.dev/)
- [React Navigation Docs](https://reactnavigation.org/)
- [Expo Docs](https://docs.expo.dev/)

## 💡 Common Tasks

### Adding a New Screen

1. Create file in `src/screens/NewScreen.js`
2. Import in `App.js`
3. Add `<Stack.Screen>` in the navigator

### Changing Theme

Edit `src/theme.js` and all screens will automatically update

### Adding Navigation Parameters

Use `route.params` in destination screen:
```javascript
const { paramName } = route.params;
```

---

Happy coding! 🌱

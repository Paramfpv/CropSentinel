# CropSentinel Monorepo

AI-powered crop monitoring and farm intelligence platform designed to help farmers make proactive decisions using weather insights, satellite analysis, and intelligent recommendations.

This repository is organized as a clean, professional monorepo containing the mobile application, backend API services, and the web frontend dashboard.

---

## 📁 Monorepo Structure

```text
CropSentinel/
│
├── mobile/                 # React Native / Expo Mobile Application
│   ├── App.js
│   ├── app.json
│   ├── eas.json
│   ├── babel.config.js
│   ├── package.json
│   ├── src/                # Mobile components, screens, services
│   └── assets/             # Mobile static assets
│
├── backend/                # FastAPI Application & AI Agents
│   ├── app/                # Main application package (routers, services, db)
│   ├── tests/              # Test suite
│   ├── pyproject.toml      # Dependency specification (PEP 508 / uv)
│   └── uv.lock             # uv lockfile
│
├── frontend/               # React / Vite Web Dashboard
│   ├── src/                # Dashboard screens and visual elements
│   ├── index.html
│   ├── package.json        # Frontend dependency list
│   └── vite.config.js      # Vite configuration
│
├── docs/                   # Consolidated Documentation & Guides
│   ├── API_CONTRACT.md     # API contract schemas & specifications
│   ├── PROJECT_SUMMARY.md  # Architectural summaries
│   ├── QUICKSTART.md       # Mobile quick start guide
│   ├── RELEASE_NOTES.md    # Version release details
│   ├── TESTING_GUIDE.md    # Detailed test guides & checklists
│   ├── BUG_REPORT_TEMPLATE.md
│   └── demo_farm_review.md
│
├── README.md               # Main monorepo entry point
├── .gitignore              # Unified ignore specifications
└── LICENSE                 # MIT License file
```

---

## 🚀 Getting Started

### 📱 Mobile Application

The mobile app is built using React Native and Expo SDK 56.

1. **Navigate & Install Dependencies**:
   ```bash
   cd mobile
   npm install
   ```
2. **Start Metro Bundler**:
   ```bash
   npx expo start
   ```
3. **Run on Simulators or Physical Devices**:
   - Press `a` for Android Emulator.
   - Press `i` for iOS Simulator.
   - Scan the terminal QR code with the Expo Go app on a physical device.

---

### ⚙️ Backend Services

The backend is built with FastAPI, using Uvicorn as the ASGI web server, and integrates with PostgreSQL and the Groq/LangGraph AI engine.

1. **Navigate & Create Virtual Environment**:
   ```bash
   cd backend
   python -m venv .venv
   # Activate on Windows:
   .venv\Scripts\activate
   # Activate on macOS/Linux:
   source .venv/bin/activate
   ```
2. **Install Dependencies**:
   ```bash
   pip install -r pyproject.toml
   # OR if using uv:
   uv pip install -r pyproject.toml
   ```
3. **Configure Environment Variables**:
   Create a `.env` file from the template:
   ```bash
   cp .env.example .env
   # Add your COPERNICUS_CLIENT_ID, COPERNICUS_CLIENT_SECRET, and GROQ_API_KEY
   ```
4. **Run Server**:
   ```bash
   python -m uvicorn app.main:app --reload
   ```
   Interactive API docs will be available at [http://localhost:8000/docs](http://localhost:8000/docs).

---

### 💻 Frontend Dashboard

The web dashboard is built using React 19, Tailwind CSS, and Vite.

1. **Navigate & Install Dependencies**:
   ```bash
   cd frontend
   npm install
   ```
2. **Start Development Server**:
   ```bash
   npm run dev
   ```
3. **Build Production Bundle**:
   ```bash
   npm run build
   ```

---

## 🎯 Submission & APK Details

> [!IMPORTANT]
> The initial hackathon submission version remains fully preserved and reproducible.
> - **Submission Git Tag**: `v1.0.0-submission`
> - **Submission Branch**: `main`
>
> To check out the original submission codebase exactly as submitted, run:
> ```bash
> git checkout v1.0.0-submission
> ```

### APK Installation
The final submission build can be installed directly on physical Android devices:
1. **Download the APK**: [CropSentinel v1.0.0 APK](https://expo.dev/artifacts/eas/m-eaFP90nXZwAhc8rAxyae07wG41wD-8do9bvlaaUxE.apk)
2. **Scan/Install via Expo**: Visit the [Expo Build Details Page](https://expo.dev/accounts/yeshbind/projects/faraway/builds/89f6abd0-7eec-44ba-9745-e5d64a1a112f) and scan the QR code to install.

---

## ✨ Features

### Mobile Application
- **Farm Management**: Easy addition, modification, and deletion of fields.
- **Real Backend Integration**: Fully integrated API endpoints for live dynamic data.
- **Authentication Flow**: Validated authentication using phone numbers or email.
- **Dynamic Farm Analysis**: Localized satellite indicators and NDVI metrics.
- **Weather Insights**: Real-time forecasts fetched directly from Open-Meteo API.
- **Alerts Feed**: Actionable and categorized risk notifications.
- **Recommendations Engine**: Intelligent suggestions for active agricultural interventions.
- **Bilingual Support**: Full translation support for English and Hindi.
- **Native Haptics**: Clear physical feedback for all interactions.
- **Demo Mode Support**: Switch to load offline simulations for judging presentation.

### Backend
- FastAPI services.
- JWT authentication.
- Farm CRUD APIs.
- Analysis APIs.
- Historical data endpoints.
- AI Recommendations & Copernicus satellite mock integration.

### Web Dashboard
- Fully-featured React/Vite dashboard.
- Field view visualization, notifications feed, and analytics charts.

---

## 👥 Team Members

* **Param** — Backend + AI Agents
* **Aayush** — Web Dashboard
* **Yesh** — Mobile Application

---

## 📝 Known Limitations

* **Location Input**: Interactive map coordinate selection was replaced with current location GPS queries and manual coordinate entry to prioritize client-side submission stability.
* **Weather Dependency**: External weather metrics depend entirely on Open-Meteo service availability and cached lookups.
* **Boundary Visuals**: Farm polygon boundary drawing is planned for future releases (currently displays visual placeholders).

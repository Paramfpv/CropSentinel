# 🌱 CropSentinel Frontend Dashboard

CropSentinel's frontend is a modern React + Vite dashboard designed to help farmers, agricultural advisors, and stakeholders monitor farm conditions, visualize satellite intelligence, and receive actionable recommendations based on backend analysis.

The dashboard transforms weather insights, satellite-derived indicators, and intervention recommendations into an intuitive and mobile-friendly user experience.

---

#  Key Features

## Farm Management

* Create and manage multiple farms.
* View farm details including area, crop information, and location.
* Unified farm selection across all intelligence modules.

## Soil Intelligence Dashboard

* NDVI visualization.
* Farm health monitoring.
* Weather-based analysis.
* Risk assessment indicators.

## Intervention Recommendations

* Displays backend-generated intervention actions.
* Provides reasoning and estimated impacts.
* Supports proactive farm management decisions.

## Weather Intelligence

* Temperature monitoring.
* Humidity tracking.
* Rainfall probability analysis.
* Weather impact summaries.

## Prediction & Insights

* Farm performance insights.
* Trend visualization.
* Market intelligence modules.
* Future-ready architecture for expanded predictive analytics.

## Multi-Language Support

* English
* Hindi
* Gujarati

Language switching is available throughout the application to improve accessibility for local farmers.

## Global State Management

A centralized AppContext architecture ensures data consistency across:

* My Farms
* Soil Intelligence
* Prediction Engine
* Intervention Screen
* Alerts
* Profile

The selected farm remains synchronized throughout the application.

## Responsive Experience

Designed for:

* Mobile Devices
* Tablets
* Laptops
* Desktop Monitors

Includes adaptive layouts and optimized dashboard rendering.

---

# Technology Stack

### Frontend Framework

* React 18

### Build Tool

* Vite

### State Management

* React Context API

### Mapping

* Leaflet
* React Leaflet

### Notifications

* React Hot Toast

### Icons

* Lucide React

### Styling

* Vanilla CSS
* CSS Variables
* Light/Dark Theme Support

---

# Data Flow

The frontend consumes analysis and farm data provided by backend APIs.

### Primary Backend Services

* Farm Management APIs
* Analysis APIs
* Historical Data APIs
* Weather Intelligence Services
* Satellite Intelligence Services
* Recommendation Services

### Frontend Responsibilities

The frontend is responsible for:

* Data visualization
* User interaction
* State management
* Health status classification
* Localization
* Offline caching support

The frontend does not perform core agricultural analysis; analytical outputs originate from backend services and are presented through dashboard components.

---

# Local Development

## Prerequisites

* Node.js 18+
* npm

## Installation

```bash
cd frontend
npm install
```

## Start Development Server

```bash
npm run dev
```

Application URL:

```text
http://localhost:5174
```

---

# 🏗 Production Build

Generate a production build:

```bash
npm run build
```

Build output:

```text
dist/
```

The generated build can be deployed on:

* Vercel
* Netlify
* Nginx
* Static Hosting Providers

---

# Design System

The application uses centralized CSS variables for theming.

### Core Tokens

```css
--cs-bg
--cs-card
--cs-accent
--cs-text
--cs-border-soft
```

When extending the UI, prefer CSS variables instead of hardcoded color values to maintain theme consistency.

---

# Future Roadmap

Planned improvements include:

* Enhanced market intelligence integrations.
* Advanced notification infrastructure.
* Improved satellite trend analytics.
* Expanded AI-assisted advisory capabilities.
* Historical farm performance reporting.
* Farm boundary visualization.

---


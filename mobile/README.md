# TruthGuard Mobile App

A cross-platform mobile client for **TruthGuard** (AI Misinformation Detector), built using React Native and Expo. This mobile application replicates the features of the TruthGuard web interface, offering real-time claims analysis, trending hoaxes reports, and guidelines resources with a premium glassmorphic UI.

---

## 🚀 Key Features

* **🔍 Real-Time Claim Verification**: Copy and paste news text or URLs to get an AI Verdict (Factual/Misinformation/Satire) and Confidence Score from Gemini 2.5 Flash.
* **🌍 Trending Claims**: Lists verified debunked claims globally via Google Fact Check Tools API integration.
* **📄 Ethics & Guidelines**: Detailed transparency section on AI limitations, privacy guidelines, and ethics.
* **✨ Glassmorphic Layout**: Responsive and beautiful gradients, cards, and micro-animations designed specifically for mobile screen dimensions.

---

## 🛠️ Setup Instructions

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or newer recommended)
* [Expo Go](https://expo.dev/client) app installed on your physical iOS/Android device (to test on physical hardware) OR an Emulator setup (Android Studio / Xcode).

### 1. Install Dependencies
Navigate to the `mobile` directory and run:
```bash
npm install
```

### 2. Configure API Endpoint
Before starting, update the server API endpoint inside [config.js](./config.js).
* By default, it points to the production server: `https://truthguard-backend.vercel.app`.
* To connect to your **local backend server**:
  - Run the local backend at the root directory (`node backend/index.js` or `npm run dev`).
  - Determine your computer's local IP address (e.g., `192.168.1.100`).
  - Update `API_URL` in [config.js](./config.js):
    ```javascript
    export const API_URL = "http://192.168.1.100:5000"; // Use your local computer's IP
    ```

### 3. Start Expo Dev Server
Start the development server by running:
```bash
npx expo start
```

* **Physical Device**: Scan the QR code shown in the terminal using your phone camera (iOS) or the Expo Go app (Android). Make sure your phone and computer are connected to the same Wi-Fi network.
* **Emulator**: Press `a` for Android Emulator or `i` for iOS Simulator.

---

## 📂 Code Structure

```text
mobile/
├── assets/                    # Image assets (icons, splash screen, logos)
├── components/                # Reusable UI elements
│   ├── GradientBackground.js  # App-wide Linear Gradient styling wrapper
│   ├── Header.js              # Styled logo and header branding
│   └── TabBar.js              # Custom bottom tab navigation
├── screens/                   # Screen views
│   ├── HomeScreen.js          # AI Input Analyzer & Result representation
│   ├── TrendingScreen.js      # List of global debunked hoaxes
│   ├── TrendingDetailScreen.js# Full claim verification report
│   └── GuidelinesScreen.js    # Operational guidelines & ethics
├── App.js                     # Main application entry point & router
├── app.json                   # Expo configuration metadata
├── config.js                  # Global configurations (API endpoint)
└── package.json               # Package dependencies & scripts
```

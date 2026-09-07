import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ActivityIndicator,
  StatusBar
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import GradientBackground from './components/GradientBackground';
import Header from './components/Header';
import TabBar from './components/TabBar';
import HomeScreen from './screens/HomeScreen';
import TrendingScreen from './screens/TrendingScreen';
import TrendingDetailScreen from './screens/TrendingDetailScreen';
import GuidelinesScreen from './screens/GuidelinesScreen';
import GoogleLensScanner from './components/GoogleLensScanner';

export default function App() {
  const [isSplashing, setIsSplashing] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [isLensOpen, setIsLensOpen] = useState(false);


  useEffect(() => {
    // Hide splash screen after 3 seconds
    const timer = setTimeout(() => {
      setIsSplashing(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Handle splash screen rendering
  if (isSplashing) {
    return (
      <GradientBackground>
        <ExpoStatusBar style="dark" />
        <View style={styles.splashContainer}>
          <Image
            source={require('./assets/truthguard-logo.png')}
            style={styles.splashLogo}
          />
          <Text style={styles.splashTitle}>TRUTHGUARD</Text>
          <Text style={styles.splashSubtitle}>VERIFY BEFORE YOU TRUST</Text>
          
          <View style={styles.splashLoader}>
            <ActivityIndicator size="small" color="#65A9E0" />
          </View>
        </View>
      </GradientBackground>
    );
  }

  // Render the current view based on state
  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'trending':
        if (selectedClaim) {
          return (
            <TrendingDetailScreen
              item={selectedClaim}
              onBack={() => setSelectedClaim(null)}
            />
          );
        }
        return (
          <TrendingScreen
            onClaimClick={(claim) => setSelectedClaim(claim)}
          />
        );
      case 'guidelines':
        return <GuidelinesScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <GradientBackground>
      <ExpoStatusBar style="dark" />
      {/* Main app layout wrapper */}
      <View style={styles.appContainer}>
        {/* Main Header */}
        <Header />

        {/* Screen Content Area */}
        <View style={styles.screenContainer}>
          {renderScreen()}
        </View>

        {/* Bottom Tab Bar navigation */}
        <TabBar activeTab={activeTab} setActiveTab={(tab) => {
          if (tab === 'lens') {
            setIsLensOpen(true);
            return;
          }
          // If we navigate away from trending tab, clear selected claim
          if (tab !== 'trending') {
            setSelectedClaim(null);
          }
          setActiveTab(tab);
        }} />

        {/* Global Google Lens OCR Scanner */}
        <GoogleLensScanner
          visible={isLensOpen}
          onClose={() => setIsLensOpen(false)}
        />
      </View>
    </GradientBackground>
  );
}


const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashLogo: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
    marginBottom: 24,
  },
  splashTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1A365D',
    letterSpacing: 4,
    marginBottom: 8,
  },
  splashSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(26, 54, 93, 0.6)',
    letterSpacing: 2,
    marginBottom: 40,
  },
  splashLoader: {
    marginTop: 10,
  },
  appContainer: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
    paddingTop: 10,
  },
});

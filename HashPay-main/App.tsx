
import React, { useState, useEffect } from 'react';
import { AppScreen } from './types';
import SplashScreen from './screens/SplashScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import AuthScreen from './screens/AuthScreen';
import DashboardScreen from './screens/DashboardScreen';
import SendScreen from './screens/SendScreen';
import ReceiveScreen from './screens/ReceiveScreen';
import TransactionDetailsScreen from './screens/TransactionDetailsScreen';
import EscrowScreen from './screens/EscrowScreen';
import VoiceAssistantScreen from './screens/VoiceAssistantScreen';
import SettingsScreen from './screens/SettingsScreen';
import OfflineModeScreen from './screens/OfflineModeScreen';
import AssetsScreen from './screens/AssetsScreen';
import SwapScreen from './screens/SwapScreen';
import ScanScreen from './screens/ScanScreen';
import VaultScreen from './screens/VaultScreen';
import BuyScreen from './screens/BuyScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import ContactsScreen from './screens/ContactsScreen';
import AssetDetailsScreen from './screens/AssetDetailsScreen';
import RecoveryPhraseScreen from './screens/RecoveryPhraseScreen';
import NetworkSettingsScreen from './screens/NetworkSettingsScreen';
import FiatDashboardScreen from './screens/FiatDashboardScreen';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from './WalletContext';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.SPLASH);
  const [currentAssetDetails, setCurrentAssetDetails] = useState<string | null>(null);
  const { isAuthenticated } = useWallet();

  useEffect(() => {
    if (currentScreen === AppScreen.SPLASH) {
      const timer = setTimeout(() => {
        setCurrentScreen(AppScreen.ONBOARDING);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  // Protected Route Guard
  useEffect(() => {
    const publicScreens = [AppScreen.SPLASH, AppScreen.ONBOARDING, AppScreen.AUTH];
    if (!publicScreens.includes(currentScreen) && !isAuthenticated) {
      setCurrentScreen(AppScreen.AUTH);
    }
  }, [isAuthenticated, currentScreen]);

  const renderScreen = () => {
    switch (currentScreen) {
      case AppScreen.SPLASH:
        return <SplashScreen />;
      case AppScreen.ONBOARDING:
        return <OnboardingScreen onFinish={() => setCurrentScreen(AppScreen.AUTH)} />;
      case AppScreen.AUTH:
        return <AuthScreen onLogin={() => setCurrentScreen(AppScreen.DASHBOARD)} />;
      case AppScreen.DASHBOARD:
        return (
          <DashboardScreen
            onNavigate={(screen) => setCurrentScreen(screen)}
          />
        );
      case AppScreen.SEND:
        return (
          <SendScreen
            onBack={() => setCurrentScreen(AppScreen.DASHBOARD)}
            onConfirm={() => setCurrentScreen(AppScreen.TRANSACTION_DETAILS)}
            onNavigate={(screen) => setCurrentScreen(screen)}
          />
        );
      case AppScreen.RECEIVE:
        return <ReceiveScreen onBack={() => setCurrentScreen(AppScreen.DASHBOARD)} />;
      case AppScreen.TRANSACTION_DETAILS:
        return <TransactionDetailsScreen onBack={() => setCurrentScreen(AppScreen.DASHBOARD)} />;
      case AppScreen.ESCROW:
        return <EscrowScreen onBack={() => setCurrentScreen(AppScreen.DASHBOARD)} />;
      case AppScreen.VOICE_ASSISTANT:
        return <VoiceAssistantScreen
          onBack={() => setCurrentScreen(AppScreen.DASHBOARD)}
          onNavigate={(screen) => setCurrentScreen(screen)}
        />;
      case AppScreen.SETTINGS:
        return <SettingsScreen
          onBack={() => setCurrentScreen(AppScreen.DASHBOARD)}
          onDisconnect={() => setCurrentScreen(AppScreen.AUTH)}
          onNavigate={(screen) => setCurrentScreen(screen)}
        />;
      case AppScreen.OFFLINE_MODE:
        return <OfflineModeScreen onBack={() => setCurrentScreen(AppScreen.SETTINGS)} />;
      case AppScreen.ASSETS:
        return <AssetsScreen
          onBack={() => setCurrentScreen(AppScreen.DASHBOARD)}
          onNavigate={(screen, params) => {
            if (screen === AppScreen.ASSET_DETAILS && typeof params === 'string') {
              setCurrentAssetDetails(params);
            }
            setCurrentScreen(screen);
          }}
        />;
      case AppScreen.SWAP:
        return <SwapScreen onBack={() => setCurrentScreen(AppScreen.DASHBOARD)} />;
      case AppScreen.SCAN:
        return <ScanScreen onBack={() => setCurrentScreen(AppScreen.DASHBOARD)} onNavigate={(screen) => setCurrentScreen(screen)} />;
      case AppScreen.VAULT:
        return <VaultScreen onBack={() => setCurrentScreen(AppScreen.DASHBOARD)} />;
      case AppScreen.BUY:
        return <BuyScreen onBack={() => setCurrentScreen(AppScreen.DASHBOARD)} />;
      case AppScreen.NOTIFICATIONS:
        return <NotificationsScreen onBack={() => setCurrentScreen(AppScreen.DASHBOARD)} />;
      case AppScreen.CONTACTS:
        return <ContactsScreen onBack={() => setCurrentScreen(AppScreen.DASHBOARD)} />;
      case AppScreen.ASSET_DETAILS:
        return <AssetDetailsScreen onBack={() => setCurrentScreen(AppScreen.ASSETS)} assetSymbol={currentAssetDetails || 'SUI'} />;
      case AppScreen.RECOVERY_PHRASE:
        return <RecoveryPhraseScreen onBack={() => setCurrentScreen(AppScreen.SETTINGS)} />;
      case AppScreen.NETWORK_SETTINGS:
        return <NetworkSettingsScreen onBack={() => setCurrentScreen(AppScreen.SETTINGS)} />;
      case AppScreen.FIAT_DASHBOARD:
        return <FiatDashboardScreen onBack={() => setCurrentScreen(AppScreen.DASHBOARD)} />;
      default:
        return <DashboardScreen onNavigate={(screen) => setCurrentScreen(screen)} />;
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen relative overflow-x-hidden bg-background-dark shadow-[0_0_100px_rgba(0,0,0,0.8)] border-x border-white/5">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.02, y: -10 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col min-h-screen"
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default App;


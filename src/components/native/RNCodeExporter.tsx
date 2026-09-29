import React, { useState } from 'react';
import {
  Code,
  Copy,
  Check,
  Download,
  Smartphone,
  Layers,
  Terminal,
  ExternalLink,
  X
} from 'lucide-react';

interface RNCodeExporterProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RNCodeExporter({ isOpen, onClose }: RNCodeExporterProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'app' | 'package' | 'expo_config' | 'instructions'>('app');

  if (!isOpen) return null;

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const appNativeCode = `/**
 * Move NZ - React Native Cross-Platform Root
 * Built for iOS and Android with React Navigation & React Native Primitives
 */
import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RNCustomerApp } from './src/components/native/RNCustomerApp';
import { RNDriverApp } from './src/components/native/RNDriverApp';
import { LogisticsProvider } from './src/context/LogisticsContext';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <LogisticsProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#090e17" />
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={{
              headerShown: false,
              tabBarStyle: {
                backgroundColor: '#0f172a',
                borderTopColor: '#1e293b',
                height: 60,
                paddingBottom: 8,
              },
              tabBarActiveTintColor: '#38bdf8',
              tabBarInactiveTintColor: '#64748b',
            }}
          >
            <Tab.Screen
              name="Customer"
              component={RNCustomerApp}
              options={{
                tabBarLabel: 'Customer Delivery',
              }}
            />
            <Tab.Screen
              name="DriverPartner"
              component={RNDriverApp}
              options={{
                tabBarLabel: 'Move Partner (NZ)',
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </LogisticsProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090e17',
  },
});
`;

  const packageJsonCode = `{
  "name": "move-nz-logistics",
  "version": "1.0.0",
  "main": "node_modules/expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "@react-navigation/native": "^6.1.18",
    "@react-navigation/bottom-tabs": "^6.6.1",
    "@react-navigation/native-stack": "^6.10.1",
    "expo": "~52.0.0",
    "expo-status-bar": "~2.0.0",
    "react": "18.3.1",
    "react-native": "0.76.6",
    "react-native-safe-area-context": "4.12.0",
    "react-native-screens": "~4.4.0",
    "react-native-web": "~0.19.13"
  },
  "devDependencies": {
    "@babel/core": "^7.25.2",
    "@types/react": "~18.3.12",
    "typescript": "^5.3.3"
  },
  "private": true
}`;

  const expoConfigCode = `{
  "expo": {
    "name": "Move Logistics NZ",
    "slug": "move-nz",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "dark",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#090e17"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "nz.move.logistics"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#090e17"
      },
      "package": "nz.move.logistics"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}`;

  const instructionsText = `# How to Run Move NZ in React Native

### 1. Initialize Expo React Native App
\`\`\`bash
npx create-expo-app --template blank-typescript move-nz
cd move-nz
\`\`\`

### 2. Install Navigation & Dependencies
\`\`\`bash
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/native-stack react-native-safe-area-context react-native-screens
\`\`\`

### 3. Copy Move NZ Native Components
- Copy \`src/components/native/RNCustomerApp.tsx\`
- Copy \`src/components/native/RNDriverApp.tsx\`
- Copy \`src/context/LogisticsContext.tsx\` and \`src/data/mockData.ts\`
- Replace \`App.tsx\` with the code provided in the App.native.tsx tab

### 4. Run on iOS Simulator, Android Emulator, or Physical Phone
\`\`\`bash
# Start Expo development server (scan QR code with Expo Go app)
npx expo start

# Run on iOS simulator (requires macOS and Xcode)
npm run ios

# Run on Android emulator (requires Android Studio)
npm run android
\`\`\`
`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">
                  React Native Mobile Technology Hub
                </h3>
                <span className="text-[10px] font-bold bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/30">
                  Cross-Platform iOS & Android
                </span>
              </div>
              <p className="text-xs text-slate-400">
                100% native React Native components (`View`, `Text`, `TouchableOpacity`, `StyleSheet`) running via `react-native-web` & ready for Expo
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub Navigation */}
        <div className="flex items-center border-b border-slate-800 bg-slate-950/40 px-6">
          <button
            type="button"
            onClick={() => setActiveTab('app')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition ${
              activeTab === 'app'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            App.native.tsx
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('package')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition ${
              activeTab === 'package'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            package.json
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('expo_config')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition ${
              activeTab === 'expo_config'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            app.json (Expo Config)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('instructions')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition ${
              activeTab === 'instructions'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Quickstart Guide
          </button>
        </div>

        {/* Code Content Area */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-950 font-mono text-xs">
          {activeTab === 'app' && (
            <div className="relative">
              <button
                type="button"
                onClick={() => handleCopy('app', appNativeCode)}
                className="absolute top-2 right-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-sans flex items-center gap-1.5 border border-slate-700 shadow-md transition"
              >
                {copiedKey === 'app' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
              <pre className="text-slate-300 leading-relaxed overflow-x-auto pr-28">
                {appNativeCode}
              </pre>
            </div>
          )}

          {activeTab === 'package' && (
            <div className="relative">
              <button
                type="button"
                onClick={() => handleCopy('package', packageJsonCode)}
                className="absolute top-2 right-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-sans flex items-center gap-1.5 border border-slate-700 shadow-md transition"
              >
                {copiedKey === 'package' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy JSON</span>
                  </>
                )}
              </button>
              <pre className="text-slate-300 leading-relaxed overflow-x-auto pr-28">
                {packageJsonCode}
              </pre>
            </div>
          )}

          {activeTab === 'expo_config' && (
            <div className="relative">
              <button
                type="button"
                onClick={() => handleCopy('expo', expoConfigCode)}
                className="absolute top-2 right-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-sans flex items-center gap-1.5 border border-slate-700 shadow-md transition"
              >
                {copiedKey === 'expo' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Config</span>
                  </>
                )}
              </button>
              <pre className="text-slate-300 leading-relaxed overflow-x-auto pr-28">
                {expoConfigCode}
              </pre>
            </div>
          )}

          {activeTab === 'instructions' && (
            <div className="font-sans text-slate-300 leading-relaxed whitespace-pre-wrap">
              {instructionsText}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Terminal className="w-4 h-4 text-blue-400" />
            <span>Target Runtimes: Expo Go · React Native CLI · iOS 14+ · Android 9+</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

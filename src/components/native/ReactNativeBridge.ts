/**
 * React Native Cross-Platform Bridge
 * Exports standard React Native core components and hooks (View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform, Dimensions, Animated, etc.)
 * backed by react-native-web in the browser runtime and 100% compliant with React Native iOS/Android apps.
 */

import { Platform } from 'react-native';

export {
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Pressable,
  ScrollView,
  FlatList,
  TextInput,
  Image,
  StyleSheet,
  Platform,
  Dimensions,
  Animated,
  Easing,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
  Modal,
  Switch,
  Alert
} from 'react-native';

// Cross-platform theme tokens matching React Native mobile UI design
export const RNTheme = {
  colors: {
    primary: '#0055FF',
    primaryDark: '#003db3',
    primaryLight: 'rgba(0, 85, 255, 0.15)',
    secondary: '#10b981',
    accent: '#f59e0b',
    danger: '#ef4444',
    background: '#090e17',
    surface: '#0d1522',
    surfaceCard: '#131e33',
    border: '#1e2c45',
    textPrimary: '#ffffff',
    textSecondary: '#94a3b8',
    textMuted: '#64748b'
  },
  typography: {
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Plus Jakarta Sans, system-ui, sans-serif'
    })
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999
  }
};

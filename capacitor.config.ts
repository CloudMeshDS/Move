import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cloudmesh.move.customer',
  appName: 'Move Logistics',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;

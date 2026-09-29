import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cloudmesh.move.driver',
  appName: 'Move Partner',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;

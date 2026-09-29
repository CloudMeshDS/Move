import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const target = process.argv[2] || 'customer'; // 'customer' | 'driver'

if (target !== 'customer' && target !== 'driver') {
  console.error('Invalid target. Use "customer" or "driver"');
  process.exit(1);
}

const config = {
  customer: {
    appId: 'com.cloudmesh.move.customer',
    appName: 'Move Logistics',
    apkName: 'Move-Customer-App.apk'
  },
  driver: {
    appId: 'com.cloudmesh.move.driver',
    appName: 'Move Partner',
    apkName: 'Move-Driver-Partner.apk'
  }
}[target];

console.log(`\n🚀 Configuring Android build for [${config.appName}] (${config.appId})...\n`);

// 1. Update capacitor.config.ts
const capConfigPath = path.join(rootDir, 'capacitor.config.ts');
const capConfigContent = `import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: '${config.appId}',
  appName: '${config.appName}',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
`;
fs.writeFileSync(capConfigPath, capConfigContent, 'utf8');
console.log('✓ Updated capacitor.config.ts');

// 2. Update android strings.xml
const stringsPath = path.join(rootDir, 'android', 'app', 'src', 'main', 'res', 'values', 'strings.xml');
if (fs.existsSync(stringsPath)) {
  const stringsContent = `<?xml version='1.0' encoding='utf-8'?>
<resources>
    <string name="app_name">${config.appName}</string>
    <string name="title_activity_main">${config.appName}</string>
    <string name="package_name">${config.appId}</string>
    <string name="custom_url_scheme">${config.appId}</string>
</resources>
`;
  fs.writeFileSync(stringsPath, stringsContent, 'utf8');
  console.log('✓ Updated android strings.xml');
}

// 3. Update android app build.gradle applicationId
const gradlePath = path.join(rootDir, 'android', 'app', 'build.gradle');
if (fs.existsSync(gradlePath)) {
  let gradleContent = fs.readFileSync(gradlePath, 'utf8');
  gradleContent = gradleContent.replace(/applicationId "[^"]+"/g, `applicationId "${config.appId}"`);
  fs.writeFileSync(gradlePath, gradleContent, 'utf8');
  console.log('✓ Updated android/app/build.gradle applicationId');
}

// 4. Build web bundle with VITE_APP_TARGET environment variable
console.log(`\n📦 Building Vite web assets for target: ${target}...`);
execSync(`node ./node_modules/vite/bin/vite.js build`, {
  cwd: rootDir,
  stdio: 'inherit',
  env: {
    ...process.env,
    VITE_APP_TARGET: target,
    VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL || 'https://gqyvttttlrncbjnxcpzj.supabase.co',
    VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_3rUQdsDgkaqezStIicO1Cw_EQt6I4j0'
  }
});

// 5. Sync Capacitor Android
console.log('\n📲 Syncing Capacitor Android assets...');
execSync(`node ./node_modules/@capacitor/cli/bin/capacitor sync android`, {
  cwd: rootDir,
  stdio: 'inherit'
});

console.log(`\n🎉 Android project configured for [${config.appName}]!`);


import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.477935605aeb40c184ac381589a742ca',
  appName: 'vidmigo',
  webDir: 'dist',
  server: {
    url: 'https://47793560-5aeb-40c1-84ac-381589a742ca.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    // Configure permissions for Android
    Permissions: {
      permissions: [
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE"
      ]
    }
  }
};

export default config;

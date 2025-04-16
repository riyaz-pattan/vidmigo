
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vidmigo.app',
  appName: 'Vidmigo',
  webDir: 'dist',
  server: {
    url: 'https://47793560-5aeb-40c1-84ac-381589a742ca.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Permissions: {
      permissions: [
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE",
        "android.permission.MANAGE_EXTERNAL_STORAGE"
      ]
    },
    CapacitorFilesystem: {
      androidPermissionRequestCode: 1001
    }
  },
  android: {
    allowMixedContent: true
  }
};

export default config;

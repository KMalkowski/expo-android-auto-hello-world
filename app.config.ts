require("ts-node/register");
import { type ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "expo-android-auto-hello-world",
  slug: "expo-android-auto-hello-world",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "expoandroidautohelloworld",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: "com.anonymous.expoandroidautohelloworld",
    edgeToEdgeEnabled: true,
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
    ],
    "./plugins/android-auto/withAndroidAuto",
  ],
  experiments: {
    typedRoutes: true,
  },
};

export default config;

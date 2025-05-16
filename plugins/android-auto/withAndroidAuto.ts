import { ExpoConfig } from "expo/config";
import configPlugins from "@expo/config-plugins";

const { AndroidConfig, withAndroidManifest, createRunOncePlugin } =
  configPlugins;

const withAndroidAuto = (config: ExpoConfig) => {
  config = manifestModifier(config);
  return config;
};

const manifestModifier = (config: ExpoConfig) => {
  return withAndroidManifest(config, (config) => {
    const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(
      config.modResults,
    );
    const manifest = config.modResults;

    AndroidConfig.Manifest.addMetaDataItemToMainApplication(
      mainApplication,
      "androidx.car.app.minCarApiLevel",
      "1",
    );

    AndroidConfig.Manifest.addMetaDataItemToMainApplication(
      mainApplication,
      "com.google.android.gms.car.application",
      "@xml/automotive_app_desc",
      "resource",
    );

    AndroidConfig.Permissions.addPermission(
      manifest,
      "androidx.car.app.ACCESS_SURFACE",
    );

    AndroidConfig.Permissions.addPermission(
      manifest,
      "androidx.car.app.MAP_TEMPLATES",
    );

    const services = mainApplication.service || [];
    const hasService = services.some(
      (s) => s.$["android:name"] === "com.anonymous.expoandroidautohelloworld",
    );
    if (!hasService) {
      const serviceNode = {
        $: {
          "android:name": "com.anonymous.expoandroidautohelloworld",
          "android:exported":
            "true" as configPlugins.AndroidConfig.Manifest.StringBoolean,
        },
        "intent-filter": [
          {
            action: [
              {
                $: {
                  "android:name": "androidx.car.app.CarAppService",
                },
              },
            ],
            category: [
              {
                $: {
                  "android:name": "androidx.car.app.category.POI",
                },
              },
            ],
          },
        ],
      };
      mainApplication.service = [serviceNode];
    }

    return config;
  });
};

export default createRunOncePlugin(withAndroidAuto, "withAndroidAuto");

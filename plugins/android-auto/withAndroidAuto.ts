import { ExpoConfig } from "expo/config";
import configPlugins from "@expo/config-plugins";
import fs from "fs/promises";
import path from "path";

const {
  AndroidConfig,
  withAndroidManifest,
  createRunOncePlugin,
  withDangerousMod,
} = configPlugins;

const withAndroidAuto = (config: ExpoConfig) => {
  config = manifestModifier(config);
  config = withAndroidAutoDependency(config);
  config = withAndroidSourceFiles(config);
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
          "android:name":
            "com.anonymous.expoandroidautohelloworld.CarAppService",
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

const withAndroidAutoDependency = (config: ExpoConfig) => {
  return withDangerousMod(config, [
    "android",
    async (props) => {
      const buildGradlePath = path.join(
        props.modRequest.platformProjectRoot,
        "app",
        "build.gradle",
      );
      const buildGradleContent = await fs.readFile(buildGradlePath, "utf-8");

      if (!buildGradleContent.includes("androidx.car.app:app:1.7.0-rc01")) {
        const updatedContent = buildGradleContent.replace(
          /dependencies\s*{/,
          `dependencies {
    implementation "androidx.car.app:app:1.7.0-rc01"`,
        );
        await fs.writeFile(buildGradlePath, updatedContent);
      }

      return props;
    },
  ]);
};

const withAndroidSourceFiles = (config: ExpoConfig) => {
  const packageName = config.android?.package;

  config = withDangerousMod(config, [
    "android",
    async (props) => {
      const projectRoot = props.modRequest.projectRoot;
      const sourceDir = path.join(projectRoot, "plugins/android-auto/src");
      const targetDir = path.join(
        projectRoot,
        "android",
        "app",
        "src",
        "main",
        "java",
        ...(packageName?.split(".") ?? []),
      );

      await fs.mkdir(targetDir, { recursive: true });
      await fs.cp(sourceDir, targetDir, {
        recursive: true,
        force: true,
      });

      const xmlDir = path.join(
        projectRoot,
        "android",
        "app",
        "src",
        "main",
        "res",
        "xml",
      );

      await fs.mkdir(xmlDir, { recursive: true });
      await fs.cp(
        path.join(projectRoot, "plugins/android-auto/automotive_app_desc.xml"),
        path.join(xmlDir, "automotive_app_desc.xml"),
        { force: true },
      );

      return props;
    },
  ]);

  return config;
};

export default createRunOncePlugin(withAndroidAuto, "withAndroidAuto");

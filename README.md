# From 0 to Hello World in Android Auto using [expo-config-plugins](https://docs.expo.dev/config-plugins/introduction/)

## Let's start by initializing our plugin, which will modify the Android project during ```expo prebuild```

1. Migrate your app.json file to a TypeScript app.config.ts file so that you can use config plugins written in TypeScript without issues. See the "app.config.ts" commit in this repo or the [expo docs](https://docs.expo.dev/guides/typescript/).

Prerequisite:
```npm install -D ts-node```

2. Create a plugins/android-auto folder and a withAndroidAuto.ts file, and add its path to the plugins array in your app.config.ts file. See the "withAndroidAuto.ts" commit in this repo.

3. Modify the AndroidManifest.xml file to include the required androidx car app metadata entries and permissions using a helper from expo. Add a service entry to the manifest file that points to your CarAppService class implementation (the entry point to your car application) and update the car app category. See the "AndroidManifest.xml" commit in this repo.

  - Update the com.anonymous.expoandroidautohelloworld path to match your project name and file path from the step 5.
  - Add the [permissions](https://developer.android.com/reference/androidx/car/app/CarAppPermission) for templates and other features required by your specific use case.

4. Modify the build.gradle file to include the required [androidx car app dependency](https://developer.android.com/jetpack/androidx/releases/car-app). See the "build.gradle" commit in this repo.

5. Copy Kotlin files to the Android project. See the "kotlin src" commit in this repo.
  - Create a new plugins/android-auto/src folder.
  - Add a basic CarAppService.kt.
  - Add your first screen - HelloWorldScreen.kt.
  - Add the required automotive_app_desc.xml file and copy it to appropriate location in the Android project.

You can launch your app using [Desktop Head Unit](https://developer.android.com/training/cars/testing/dhu).

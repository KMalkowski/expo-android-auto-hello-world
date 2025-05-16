# From 0 to Hello World in Android Auto using [expo-config-plugins](https://docs.expo.dev/config-plugins/introduction/)

## Let's start by initializing our plugin, which will modify the Android project during ```expo prebuild```

1. Migrate your app.json file to a TypeScript app.config.ts file so that you can use config plugins written in TypeScript without issues. See the "app.config.ts" commit in this repo or the [expo docs](https://docs.expo.dev/guides/typescript/).

Prerequisite:
```npm install -D ts-node```

2. Create a plugins/android-auto folder and a withAndroidAuto.ts file, and add its path to the plugins array in your app.config.ts file. See the "withAndroidAuto.ts" commit in this repo.

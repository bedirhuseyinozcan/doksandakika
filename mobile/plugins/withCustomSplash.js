const {
  withAndroidColors,
  withAndroidStyles,
  withDangerousMod,
  AndroidConfig,
} = require('@expo/config-plugins');
const {
  generateImageAsync,
  generateImageBackgroundAsync,
  compositeImagesAsync,
} = require('@expo/image-utils');
const fs = require('fs');
const path = require('path');

const SPLASH_BG_COLOR = '#0D1117';
const SPLASH_LOGO_REL_PATH = './src/assets/doksandakika.png';

const DPI_MAP = [
  { folder: 'drawable-mdpi', scale: 1 },
  { folder: 'drawable-hdpi', scale: 1.5 },
  { folder: 'drawable-xhdpi', scale: 2 },
  { folder: 'drawable-xxhdpi', scale: 3 },
  { folder: 'drawable-xxxhdpi', scale: 4 },
];

function withCustomSplash(config) {
  // 1. Set splashscreen_background in res/values/colors.xml
  config = withAndroidColors(config, (modConfig) => {
    modConfig.modResults = AndroidConfig.Colors.assignColorValue(modConfig.modResults, {
      name: 'splashscreen_background',
      value: SPLASH_BG_COLOR,
    });
    modConfig.modResults = AndroidConfig.Colors.assignColorValue(modConfig.modResults, {
      name: 'colorPrimaryDark',
      value: SPLASH_BG_COLOR,
    });
    return modConfig;
  });

  config = withAndroidStyles(config, (modConfig) => {
    const splashThemeParent = {
      name: 'Theme.App.SplashScreen',
      parent: 'AppTheme',
    };

    modConfig.modResults = AndroidConfig.Styles.assignStylesValue(modConfig.modResults, {
      add: true,
      parent: splashThemeParent,
      name: 'windowSplashScreenBackground',
      value: '@color/splashscreen_background',
    });

    modConfig.modResults = AndroidConfig.Styles.assignStylesValue(modConfig.modResults, {
      add: true,
      parent: splashThemeParent,
      name: 'windowSplashScreenAnimatedIcon',
      value: '@drawable/splashscreen_logo',
    });

    modConfig.modResults = AndroidConfig.Styles.assignStylesValue(modConfig.modResults, {
      add: true,
      parent: splashThemeParent,
      name: 'android:windowBackground',
      value: '@color/splashscreen_background',
    });

    return modConfig;
  });

  config = withDangerousMod(config, [
    'android',
    async (modConfig) => {
      const projectRoot = modConfig.modRequest.projectRoot;
      const resRoot = path.resolve(projectRoot, 'android/app/src/main/res');
      const logoSrcPath = path.resolve(projectRoot, SPLASH_LOGO_REL_PATH);

      if (!fs.existsSync(logoSrcPath)) {
        return modConfig;
      }

      for (const { folder, scale } of DPI_MAP) {
        const targetDir = path.resolve(resRoot, folder);
        await fs.promises.mkdir(targetDir, { recursive: true });

        // Android 12+ SplashScreen icon canvas is 288dp x 288dp, inner safe circle is ~160dp
        const canvasSize = Math.round(288 * scale);
        const logoSize = Math.round(148 * scale);
        const offset = Math.round((canvasSize - logoSize) / 2);

        const bgBuffer = await generateImageBackgroundAsync({
          width: canvasSize,
          height: canvasSize,
          backgroundColor: SPLASH_BG_COLOR,
        });

        const { source: fgBuffer } = await generateImageAsync(
          { projectRoot, cacheType: 'custom-android-splash-logo' },
          {
            src: logoSrcPath,
            width: logoSize,
            height: logoSize,
            resizeMode: 'contain',
            backgroundColor: SPLASH_BG_COLOR,
          }
        );

        const composedBuffer = await compositeImagesAsync({
          background: bgBuffer,
          foreground: fgBuffer,
          x: offset,
          y: offset,
        });

        const outPath = path.resolve(targetDir, 'splashscreen_logo.png');
        await fs.promises.writeFile(outPath, composedBuffer);
      }

      const legacyGridDrawables = [
        path.resolve(resRoot, 'drawable/ic_launcher_background.xml'),
        path.resolve(resRoot, 'drawable/splashscreen_logo.xml'),
      ];
      for (const legacyFile of legacyGridDrawables) {
        if (fs.existsSync(legacyFile)) {
          await fs.promises.rm(legacyFile, { force: true });
        }
      }

      return modConfig;
    },
  ]);

  return config;
}

module.exports = withCustomSplash;

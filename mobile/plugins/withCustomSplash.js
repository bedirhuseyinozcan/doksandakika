const {
  withAndroidColors,
  withAndroidStyles,
  withDangerousMod,
  AndroidConfig,
} = require('@expo/config-plugins');
const { generateImageAsync } = require('@expo/image-utils');
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
      add: false,
      parent: splashThemeParent,
      name: 'windowSplashScreenBackground',
      value: null,
    });

    modConfig.modResults = AndroidConfig.Styles.assignStylesValue(modConfig.modResults, {
      add: false,
      parent: splashThemeParent,
      name: 'windowSplashScreenAnimatedIcon',
      value: null,
    });

    modConfig.modResults = AndroidConfig.Styles.assignStylesValue(modConfig.modResults, {
      add: true,
      parent: splashThemeParent,
      name: 'android:windowBackground',
      value: '@drawable/splashscreen_logo',
    });

    return modConfig;
  });

  config = withDangerousMod(config, [
    'android',
    async (modConfig) => {
      const projectRoot = modConfig.modRequest.projectRoot;
      const resRoot = path.resolve(projectRoot, 'android/app/src/main/res');
      const drawableRoot = path.resolve(resRoot, 'drawable');
      const logoSrcPath = path.resolve(projectRoot, SPLASH_LOGO_REL_PATH);

      await fs.promises.mkdir(drawableRoot, { recursive: true });
      
      const allDrawableFolders = ['drawable', ...DPI_MAP.map((d) => d.folder)];
      for (const folder of allDrawableFolders) {
        for (const ext of ['png', 'webp', 'xml']) {
          const candidate = path.resolve(resRoot, folder, `splashscreen_logo.${ext}`);
          if (fs.existsSync(candidate)) {
            await fs.promises.rm(candidate, { force: true });
          }
        }
      }

      if (fs.existsSync(logoSrcPath)) {
        for (const { folder, scale } of DPI_MAP) {
          const targetDir = path.resolve(resRoot, folder);
          await fs.promises.mkdir(targetDir, { recursive: true });

          const logoSize = Math.round(148 * scale);
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

          const outPath = path.resolve(targetDir, 'splash_inset_logo.png');
          await fs.promises.writeFile(outPath, fgBuffer);
        }

        const splashLayerListXml = `<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:drawable="@color/splashscreen_background"/>
    <item>
        <bitmap
            android:gravity="center"
            android:src="@drawable/splash_inset_logo"/>
    </item>
</layer-list>
`;
        await fs.promises.writeFile(
          path.resolve(drawableRoot, 'splashscreen_logo.xml'),
          splashLayerListXml,
          'utf8'
        );
      } else {
        const solidSplashXml = `<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:drawable="@color/splashscreen_background"/>
</layer-list>
`;
        await fs.promises.writeFile(
          path.resolve(drawableRoot, 'splashscreen_logo.xml'),
          solidSplashXml,
          'utf8'
        );
      }

      const launcherBgXml = `<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:drawable="@color/splashscreen_background"/>
</layer-list>
`;
      await fs.promises.writeFile(
        path.resolve(drawableRoot, 'ic_launcher_background.xml'),
        launcherBgXml,
        'utf8'
      );

      return modConfig;
    },
  ]);

  return config;
}

module.exports = withCustomSplash;

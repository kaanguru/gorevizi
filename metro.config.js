const { withNativeWind } = require('nativewind/metro');
const {
  getSentryExpoConfig
} = require("@sentry/react-native/metro");

/** @type {import('expo/metro-config').MetroConfig} */

const config = getSentryExpoConfig(__dirname);
module.exports = withNativeWind(
  () => {
    const { transformer, resolver } = config;

    config.transformer = {
      ...transformer,
    };
    config.resolver = {
      ...resolver,
    };

    return config;
  },
  { input: './global.css' },
);
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Configure resolver to properly handle react-native-quick-crypto and crypto dependencies
config.resolver = {
  ...config.resolver,
  extraNodeModules: {
    ...config.resolver.extraNodeModules,
    crypto: require.resolve('react-native-quick-crypto'),
  },
};

module.exports = withNativeWind(config, { input: './global.css' });

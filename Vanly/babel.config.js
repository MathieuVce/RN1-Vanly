module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
          blacklist: null,
          whitelist: [
            'REACT_APP_API_KEY',
            'REACT_APP_AUTH_DOMAIN',
            'REACT_APP_PROJECT_ID',
            'REACT_APP_STORAGE_BUCKET',
            'REACT_APP_MESSAGING_SENDER_ID',
            'REACT_APP_APP_ID',
          ],
          safe: false,
          allowUndefined: true,
        },
      ],
    ],
  };
};

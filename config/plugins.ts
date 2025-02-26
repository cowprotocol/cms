module.exports = () => ({
  'import-notifications': {
    enabled: true,
    resolve: './src/plugins/import-notifications',
  },
  meilisearch: {
    config: {
      host: 'http://meilisearch:7700',
      apiKey: 'masterKey', // TODO: Replace with secret key
    },
  },
});

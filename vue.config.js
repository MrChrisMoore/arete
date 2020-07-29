module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  'publicPath':'/',
  pwa: {
    name: 'Arete',
    themeColor: '#114474',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',

    // configure the workbox plugin
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      // swSrc is required in InjectManifest mode.
      swSrc: 'src/service-worker.js',
      // ...other Workbox options...
    }
  }
}
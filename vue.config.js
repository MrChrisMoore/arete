module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  'publicPath':'/',
  pwa: {
    name: 'Arete',
    themeColor: '#114474',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    // workboxOptions: {
    //   swSrc: 'src/service-worker.js'
    // }
  }
}
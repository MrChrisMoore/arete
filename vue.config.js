module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  css: {
    sourceMap: true
  },
  'publicPath':'/',
  pwa: {
    name: 'Arete',
    themeColor: '#114474',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    // workboxOptions: {
    //   swSrc: 'src/service-worker.js'
    // }
  },
 
}
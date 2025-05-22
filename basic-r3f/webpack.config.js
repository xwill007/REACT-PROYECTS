// Archivo: webpack.config.js (para Create React App necesitarás react-app-rewired)
module.exports = {
  module: {
    rules: [
      {
        test: /node_modules\/@mediapipe\/tasks-vision/,
        use: [
          {
            loader: 'source-map-loader',
            options: {
              filterSourceMappingUrl: (url, resourcePath) => {
                return false; // No intentes cargar source maps para MediaPipe
              }
            }
          }
        ]
      }
    ]
  }
};
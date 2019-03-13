module.exports = {
  entry:  './src/index.js',
  output: {
      libraryTarget: 'var',
      library: 'showSearchTemplate',
      filename: 'search-react.js',
  },
  watch: true,
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};
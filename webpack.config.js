const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    library: 'dinoql',
    libraryTarget: 'umd',
    filename: 'dinoql.min.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['ramda', '@babel/plugin-proposal-object-rest-spread']
          }
        }
      }
    ]
  }
};
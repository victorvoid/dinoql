const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    library: 'dinoql',
    libraryTarget: 'umd',
    filename: 'dinoql.min.js',
    umdNamedDefine: true,
    globalObject: 'this'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', 'flow'],
            plugins: ['@babel/plugin-proposal-object-rest-spread', 'babel-plugin-transform-flow-strip-types']
          }
        },
      }
    ]
  }
};

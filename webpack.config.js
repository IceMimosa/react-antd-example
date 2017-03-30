const path = require('path');
const fs = require('fs');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const plugins = require('./setting/plugins');
const getAlias = require('./setting/alias');
const { noParse, vendor, pass } = require('./setting/noParse');
const { ignorePattern } = require('./setting/ignore');

module.exports = (p, context) => {
  const isBuild = context['optimize-minimize'];

  const pkgPath = path.join(process.cwd(), 'package.json');
  const pkg = fs.existsSync(pkgPath) ? require(pkgPath) : {};

  let theme = {};
  if (pkg.theme && typeof pkg.theme === 'string') {
    let cfgPath = pkg.theme;
    // relative path
    if (cfgPath.charAt(0) === '.') {
      cfgPath = path.resolve(process.cwd(), cfgPath);
    }
    const getThemeConfig = require(cfgPath);
    theme = getThemeConfig();
  } else if (pkg.theme && typeof pkg.theme === 'object') {
    theme = pkg.theme;
  }

  return {
    devtool: isBuild ? false : 'eval',
    node: {
      net: 'empty',
    },
    entry: {
      app: ['./app/index.jsx'],
      vendor,
      // pass,
    },
    output: {
      path: path.resolve(__dirname, 'public'),
      filename: isBuild ? '[name].[chunkhash].js' : '[name].js',
      chunkFilename: isBuild ? '[chunkhash].chunk.js' : '[id].chunk.js',
      publicPath: '/',
    },
    module: {
      loaders: [{
          test: /\.(scss)$/,
          include: [
            path.resolve(__dirname, 'app'),
          ],
          loader: 'style-loader!css-loader!sass-loader',
        },
        {
          test(filePath) {
            return /\.less$/.test(filePath) && !/\.module\.less$/.test(filePath);
          },
          loader: ExtractTextPlugin.extract(
            'css-loader?sourceMap&-autoprefixer!' +
            'postcss-loader!' +
            `less-loader?{"sourceMap":true,"modifyVars":${JSON.stringify(theme)}}`),
        },
        {
          test: /\.module\.less$/,
          loader: ExtractTextPlugin.extract(
            'css-loader?sourceMap&modules&localIdentName=[local]___[hash:base64:5]&-autoprefixer!' +
            'postcss-loader!' +
            `less-loader?{"sourceMap":true,"modifyVars":${JSON.stringify(theme)}}`),
        },
        {
          test: /\.(css)$/,
          loader: 'style-loader!css-loader',
        },
        {
          test: ignorePattern,
          loader: 'ignore-loader',
        },
        {
          test: /\.jsx?$/,
          include: [
            path.resolve(__dirname, 'app'),
            path.resolve(__dirname, 'node_modules/react-watermark'),
          ],
          loader: 'happypack/loader?id=babel',
        },
        {
          test: /\.json$/,
          loader: 'json-loader',
        }
      ],
      noParse,
    },
    resolve: {
      alias: getAlias(path, __dirname),
      extensions: ['.js', '.jsx', '.scss'],
    },
    plugins,
  };
};

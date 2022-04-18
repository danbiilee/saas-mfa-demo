const webpack = require('webpack');
const dotenv = require('dotenv');
const { merge } = require('webpack-merge');
const base = require('../../webpack.base');
const { ModuleFederationPlugin } = webpack.container;
const { MFLiveReloadPlugin } = require('@module-federation/fmr');
const deps = require('./package.json').dependencies;

const isDevelopment = process.env.NODE_ENV !== 'production';

// Loads Environment Variables
if (isDevelopment) {
  dotenv.config({ path: '../../.env.development' });
} else {
  dotenv.config({ path: '../../.env.production' });
}

const {
  TE4M_MF_PORT_APP1: port,
  TE4M_MF_NAME_APP1: app1Name,
  TE4M_MF_URL_APP1: app1URL,
} = process.env;

// Module Federation's Configuration
const mfConfig = {
  name: app1Name,
  filename: `${app1Name}RemoteEntry.js`,
  exposes: {
    './Button': './src/components/Button',
  },
  shared: {
    ...deps,
    react: { singleton: true, requiredVersion: deps['react'] },
    'react-dom': {
      singleton: true,
      requiredVersion: deps['react-dom'],
    },
  },
};

// Webpack's Configuration
const config = merge(base(__dirname, port), {
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.PUBLIC_URL': JSON.stringify(app1URL),
    }),
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new ModuleFederationPlugin(mfConfig),
    isDevelopment &&
      new MFLiveReloadPlugin({
        port: parseInt(port),
        container: app1Name,
      }),
  ].filter(Boolean),
});

module.exports = config;

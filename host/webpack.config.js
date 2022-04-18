const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');
const { merge } = require('webpack-merge');
const base = require('../webpack.base');
const { ModuleFederationPlugin } = webpack.container;
const { MFLiveReloadPlugin } = require('@module-federation/fmr');
const deps = require('./package.json').dependencies;

const isDevelopment = process.env.NODE_ENV !== 'production';

// Loads Environment Variables
if (isDevelopment) {
  dotenv.config({ path: '../.env.development' });
} else {
  dotenv.config({ path: '../.env.production' });
}

const {
  TE4M_MF_PORT_HOST: port,
  TE4M_MF_NAME_HOST: hostName,
  TE4M_MF_URL_HOST: hostURL,
  TE4M_MF_NAME_APP1: app1Name,
  TE4M_MF_URL_APP1: app1URL,
  TE4M_MF_NAME_APP2: app2Name,
  TE4M_MF_URL_APP2: app2URL,
} = process.env;

// Module Federation's Configuration
const mfConfig = {
  name: hostName,
  shared: {
    ...deps,
    react: { singleton: true, requiredVersion: deps['react'] },
    'react-dom': {
      singleton: true,
      requiredVersion: deps['react-dom'],
    },
    'styled-components': {
      singleton: true,
      requiredVersion: deps['styled-components'],
    },
  },
};

// Webpack's Configuration
const config = merge(base(__dirname, port), {
  resolve: {
    alias: {
      '@images': path.resolve(__dirname, 'src/assets/images'),
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.PUBLIC_URL': JSON.stringify(hostURL),
    }),
    new webpack.EnvironmentPlugin([
      'NODE_ENV',
      'TE4M_MF_NAME_APP1',
      'TE4M_MF_NAME_APP2',
      'TE4M_MF_URL_APP1',
      'TE4M_MF_URL_APP2',
    ]),
    new ModuleFederationPlugin(mfConfig),
    isDevelopment &&
      new MFLiveReloadPlugin({
        port: parseInt(port),
        container: hostName,
      }),
  ].filter(Boolean),
});

module.exports = config;

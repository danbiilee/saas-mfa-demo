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
dotenv.config({ path: '../.env' });
if (isDevelopment) {
  dotenv.config({ path: '../.env.development' });
} else {
  dotenv.config({ path: '../.env.production' });
}

const {
  SAAS_FE_MF_PORT_HOST: port,
  SAAS_FE_MF_NAME_HOST: hostName,
  SAAS_FE_MF_URL_HOST: hostURL,
} = process.env;

// Module Federation's Configuration
const mfConfig = {
  name: hostName,
  shared: {
    // ...deps,
    react: { singleton: true, requiredVersion: deps['react'] },
    'react-dom': {
      singleton: true,
      requiredVersion: deps['react-dom'],
    },
    // 'styled-components': {
    //   singleton: true,
    //   requiredVersion: deps['styled-components'],
    // },
  },
};

console.log(mfConfig.shared);

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
      'SAAS_FE_MF_NAME_APP1',
      'SAAS_FE_MF_NAME_APP2',
      'SAAS_FE_MF_URL_APP1',
      'SAAS_FE_MF_URL_APP2',
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

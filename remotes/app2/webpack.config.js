const webpack = require('webpack');
const dotenv = require('dotenv');
const { merge } = require('webpack-merge');
const base = require('../../webpack.base');
const { ModuleFederationPlugin } = webpack.container;
const { MFLiveReloadPlugin } = require('@module-federation/fmr');
const deps = require('./package.json').dependencies;

const isDevelopment = process.env.NODE_ENV !== 'production';

// Loads Environment Variables
dotenv.config({ path: '../../.env' });
if (isDevelopment) {
  dotenv.config({ path: '../../.env.development' });
} else {
  dotenv.config({ path: '../../.env.production' });
}

const {
  SAAS_FE_MF_PORT_APP2: port,
  SAAS_FE_MF_NAME_APP2: app2Name,
  SAAS_FE_MF_URL_APP2: app2URL,
} = process.env;

// Module Federation's Configuration
const mfConfig = {
  name: app2Name,
  filename: `${app2Name}RemoteEntry.js`,
  exposes: {
    './Button': './src/components/Button2',
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
      'process.env.PUBLIC_URL': JSON.stringify(app2URL),
    }),
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new ModuleFederationPlugin(mfConfig),
    isDevelopment &&
      new MFLiveReloadPlugin({
        port: parseInt(port),
        container: app2Name,
      }),
  ].filter(Boolean),
});

module.exports = config;

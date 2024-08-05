import path from 'path';
import webpack from 'webpack';
import { Configuration } from 'webpack';

const config: Configuration = {
  resolve: {
    fallback: {
      buffer: require.resolve('buffer/'),
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
};

export default config;

// next.config.js
const withPlugins = require('next-compose-plugins');
const optimizedImages = require('next-optimized-images');

module.exports = withPlugins([
  [optimizedImages, {
    /* config for next-optimized-images */
  }],

],
  {
    webpack: (config, { dev }) => {
      config.module.rules.push(
        {
          test: /\.test.js$/,
          loader: 'ignore-loader'
        }
      );
      return config
    },
    images: {
      disableStaticImages: true
    }
  },
);
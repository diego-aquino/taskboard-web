const withImages = require('next-images');

const nextConfig = {
  future: {
    webpack5: true,
  },
};

const nextImagesConfig = {
  esModule: true,
};

module.exports = withImages({
  ...nextConfig,
  ...nextImagesConfig,
});

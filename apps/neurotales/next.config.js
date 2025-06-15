// apps/neurotales/next.config.js
//@ts-check

const path = require("path");
// Destructure so it’s constructable
const { TsconfigPathsPlugin } = require("tsconfig-paths-webpack-plugin");
const { composePlugins, withNx } = require("@nx/next");

/** @type {import('@nx/next/plugins/with-nx').WithNxOptions} */
const nextConfig = {
  experimental: {
    dynamicIO: true,
  },
  nx: {
    svgr: false,
  },

  webpack(config, { isServer }) {
    // 1) Alias '@' to your app root
    config.resolve.alias = config.resolve.alias || {};
    config.resolve.alias["@"] = path.resolve(__dirname);

    // 2) Apply tsconfig-paths plugin so Webpack reads your tsconfig paths
    config.resolve.plugins = config.resolve.plugins || [];
    config.resolve.plugins.push(
      new TsconfigPathsPlugin({
        extensions: config.resolve.extensions,
      })
    );

    if (isServer) {
      // 3) Treat certain dynamic modules as externals
      const dynamicExternals = ["clone-deep", "merge-deep"];
      const origExternals = Array.isArray(config.externals)
        ? config.externals
        : [config.externals];
      config.externals = [
        ...origExternals,
        /**
         * @param {{ context: string; request: string }} ctx
         * @param {string} req
         * @param {(err: Error|null, result?: string) => void} cb
         */
        (ctx, req, cb) => {
          if (dynamicExternals.includes(req)) {
            // treat as a CommonJS external
            return cb(null, "commonjs " + req);
          }
          // no error, no override
          cb(null);
        },
      ];
    }

    return config;
  },
};

module.exports = composePlugins(withNx)(nextConfig);

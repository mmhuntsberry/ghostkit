// apps/neurotales/next.config.js
//@ts-check
const path = require("path");
const { TsconfigPathsPlugin } = require("tsconfig-paths-webpack-plugin");
const { composePlugins, withNx } = require("@nx/next");

/** @type {import('@nx/next/plugins/with-nx').WithNxOptions} */
const nextConfig = {
  experimental: { dynamicIO: true },

  // 👇‑‑‑‑‑‑‑‑‑‑ add this block
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/mattthebunny/**", // adjust if your cloud name or folder differs
      },
    ],
  },
  // ^‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑

  nx: { svgr: false },

  webpack(config, { isServer }) {
    // aliases & ts‑paths
    config.resolve.alias ??= {};
    config.resolve.alias["@"] = path.resolve(__dirname);

    config.resolve.plugins ??= [];
    config.resolve.plugins.push(
      new TsconfigPathsPlugin({ extensions: config.resolve.extensions })
    );

    // server‑only externals
    if (isServer) {
      const dynamicExternals = ["clone-deep", "merge-deep"];
      const orig = Array.isArray(config.externals)
        ? config.externals
        : [config.externals];
      config.externals = [
        ...orig,
        (ctx, req, cb) =>
          dynamicExternals.includes(req)
            ? cb(null, "commonjs " + req)
            : cb(null),
      ];
    }

    return config;
  },
};

module.exports = composePlugins(withNx)(nextConfig);

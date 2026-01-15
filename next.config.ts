import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Mark @libsql packages as external for server-side
      config.externals = config.externals || [];
      config.externals.push({
        '@libsql/client': 'commonjs @libsql/client',
        '@prisma/adapter-libsql': 'commonjs @prisma/adapter-libsql',
      });
    }

    // Ignore non-JS files in node_modules
    config.module.rules.push({
      test: /\.(md|LICENSE|txt)$/,
      type: 'asset/source',
    });

    // Ignore native binaries
    config.module.rules.push({
      test: /\.node$/,
      use: 'node-loader',
    });

    return config;
  },
  // Optimize for serverless deployment
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;

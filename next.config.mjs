/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep Turbopack happy even with webpack customizations below
  turbopack: {},
  webpack: (config) => {
    // Ignore test-only dependencies pulled in by thread-stream/pino so Next build does not try to bundle them
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      tap: false,
      "why-is-node-running": false,
      // wagmi optional peer deps we don't use
      "@base-org/account": false,
      "@coinbase/wallet-sdk": false,
      "@gemini-wallet/core": false,
      "@metamask/sdk": false,
      "@safe-global/safe-apps-sdk": false,
      "@safe-global/safe-apps-provider": false,
      porto: false,
    };
    return config;
  },
};

export default nextConfig;

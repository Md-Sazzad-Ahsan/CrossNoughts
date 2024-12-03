/** @type {import('next').NextConfig} */
import withPWA from "@ducanh2912/next-pwa";

const nextConfig = {
  images: {
    domains: ["drive.google.com"], // Add image domains if required
  },
};

const pwaConfig = withPWA({
  dest: "public", 
  reloadOnOnline: true, // Ensure the app reloads to fetch fresh data
  swMinify: true, 
  disable: process.env.NODE_ENV === "development", // Disable PWA in development
  workboxOptions: {
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/.*/, // Match all requests to fetch from the network
        handler: "NetworkFirst", // Try the network first, fallback to cache
        options: {
          cacheName: "dynamic-cache",
          expiration: {
            maxEntries: 100, // Cache up to 100 requests
            maxAgeSeconds: 24 * 60 * 60, // Cache for 24 hours
          },
        },
      },
    ],
  },
});

export default pwaConfig(nextConfig);

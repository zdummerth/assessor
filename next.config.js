/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [new URL("https://ptaplfitlcnebqhoovrv.supabase.co/**")],
  },
};

module.exports = nextConfig;

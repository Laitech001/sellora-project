import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: false, // Keep TypeScript strict
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vmiwtnjskbjvvtjjcsci.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default withFlowbiteReact(nextConfig);
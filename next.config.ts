import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: [
      'tse3.mm.bing.net',
      'images.unsplash.com',
      'www.candere.com',
      'tse2.mm.bing.net',
      'd3kinlcl20pxwz.cloudfront.net',
    ],
  },
};

export default nextConfig;

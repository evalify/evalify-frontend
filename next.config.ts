import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: "/blob/:objectName*",
        destination: "http://172.17.9.74:9002/evalify/:objectName*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

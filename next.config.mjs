// next.config.mjs
const ISR_CACHE =
  "public, s-maxage=300, stale-while-revalidate=600";

export default {
  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*\\.(png|jpg|jpeg|gif|webp|svg|ico|woff|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/",
        headers: [{ key: "Cache-Control", value: ISR_CACHE }],
      },
      {
        source: "/competitions",
        headers: [{ key: "Cache-Control", value: ISR_CACHE }],
      },
      {
        source: "/rankings",
        headers: [{ key: "Cache-Control", value: ISR_CACHE }],
      },
      {
        source: "/members",
        headers: [{ key: "Cache-Control", value: ISR_CACHE }],
      },
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate",
          },
        ],
      },
    ];
  },
};

// next.config.mjs
export default {
    async headers() {
        return [
            {
                // Apply headers to all paths
                source: '/(.*)', // This matches all paths
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'no-store, no-cache, must-revalidate',
                    },
                ],
            },
        ];
    },
};

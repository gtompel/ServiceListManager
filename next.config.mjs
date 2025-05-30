/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
  webpack: (config, { dev, isServer }) => {
    // Отключаем кэширование в dev режиме
    if (dev) {
      config.cache = false;
    } else {
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: ['./next.config.mjs'],
        },
        maxAge: 172800000,
        compression: false, // Отключаем сжатие
        allowCollectingMemory: true,
      };
    }

    // Оптимизация для больших строк
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          default: false,
          vendors: false,
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 2,
          },
        },
      },
    };

    // Отключаем source maps в production
    if (!dev) {
      config.devtool = false;
    }

    return config;
  },
}

export default nextConfig

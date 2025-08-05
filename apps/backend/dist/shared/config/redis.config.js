"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisCacheModule = void 0;
const cache_manager_1 = require("@nestjs/cache-manager");
const config_1 = require("@nestjs/config");
const cache_manager_redis_store_1 = require("cache-manager-redis-store");
exports.RedisCacheModule = cache_manager_1.CacheModule.registerAsync({
    imports: [config_1.ConfigModule],
    useFactory: async (configService) => {
        return {
            store: cache_manager_redis_store_1.redisStore,
            host: configService.get('REDIS_HOST', 'localhost'),
            port: configService.get('REDIS_PORT', 6379),
            password: configService.get('REDIS_PASSWORD'),
            db: configService.get('REDIS_DB', 0),
            ttl: configService.get('REDIS_TTL', 300),
        };
    },
    inject: [config_1.ConfigService],
});
//# sourceMappingURL=redis.config.js.map
package com.filmdiscourse.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;

/**
 * Dev-profile cache configuration.
 * Replaces the Redis CacheManager with a simple in-memory implementation
 * so the app can run locally without a Redis server.
 */
@Configuration
@Profile("dev")
public class DevCacheConfig {

    @Bean
    @Primary
    public CacheManager cacheManager() {
        return new ConcurrentMapCacheManager(
                "movies", "movie", "genres", "reviews", "recommendations"
        );
    }
}

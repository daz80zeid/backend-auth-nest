import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from './cache.config';
import { CacheConfigService } from './cache.config.service';
import { env } from 'process';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      validationSchema: Joi.object({
        CACHE_TTL: Joi.number()
            .cacheTime(env.APP_HOST)
            .default(10),
      }),
    }),
  ],
  providers: [ConfigService, CacheConfigService],
  exports: [ConfigService, CacheConfigService],
})
export class CacheConfigModule {}

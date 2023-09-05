import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from './postgres.config';
import { PostgresConfigService } from './postgres.config.service';
import { env } from 'process';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      validationSchema: Joi.object({
        POSTGRES_URI: Joi.string()
          .uri()
          .default(env.POSTGRES_URI || 'postgresql://localhost:5432/crud'),
      }),
    }),
  ],
  providers: [ConfigService, PostgresConfigService],
  exports: [ConfigService, PostgresConfigService],
})
export class PostgresConfigModule {}

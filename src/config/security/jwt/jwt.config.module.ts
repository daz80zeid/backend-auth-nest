import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from './jwt.config';
import { JwtConfigService } from './jwt.config.service';
import { env } from 'process';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      validationSchema: Joi.object({
        JWT_ALGORITHM: Joi.string()
          .valid(
            'HS256',
            'HS384',
            'HS512',
            'RS256',
            'RS384',
            'RS512',
            'ES256',
            'ES384',
            'ES512',
            'PS256',
            'PS384',
            'PS512',
            'none',
          )
          .default('HS256'),
        JWT_SECRET: env.SECRET_KEY_JWT,
        JWT_PRIVATE_KEY: env.JWT_PRIVATE_KEY,
        JWT_PUBLIC_KEY: env.JWT_PUBLIC_KEY,
        JWT_EXPIRES_IN: env.JWT_EXPIRES_IN,
      })
        .with('JWT_PRIVATE_KEY', 'JWT_PUBLIC_KEY')
        .or('JWT_SECRET', 'JWT_PRIVATE_KEY'),
    }),
  ],
  providers: [ConfigService, JwtConfigService],
  exports: [ConfigService, JwtConfigService],
})
export class JwtConfigModule {}

import { registerAs } from '@nestjs/config';
import { env } from 'process';

export const config = registerAs('app', () => ({
  env: env.NODE_ENV || env.APP_ENV,
  host: env.HOST || env.APP_HOST,
  port: env.PORT || env.APP_PORT,
}));

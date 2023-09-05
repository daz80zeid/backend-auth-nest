import { registerAs } from '@nestjs/config';
import { env } from 'process';

export const config = registerAs('data.postgres', () => ({
  uri: env.POSTGRESQL_URI,
}));

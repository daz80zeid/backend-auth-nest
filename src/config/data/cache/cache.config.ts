import { registerAs } from '@nestjs/config';
import { env } from 'process';

export const config = registerAs('data.cache', () => ({
  ttl: Number.parseInt(env.CACHE_TTL, 10),
}));

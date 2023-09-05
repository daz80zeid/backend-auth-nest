import { registerAs } from '@nestjs/config';
import { env } from 'process';

export const config = registerAs('security.jwt', () => ({
  algorithm: env.JWT_ALGORITHM,
  secret: env.JWT_SECRET,
  privateKey: env.JWT_PRIVATE_KEY,
  publicKey: env.JWT_PUBLIC_KEY,
  expiresIn: env.JWT_EXPIRES_IN,
}));

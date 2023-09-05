import { registerAs } from '@nestjs/config';
import { serviceAccount } from './firebase-service-account';

export const config = registerAs('firebase', () => ({
  credentials: serviceAccount,
}));

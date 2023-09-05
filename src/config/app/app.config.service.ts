import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppEnv } from './enum/app-env.enum';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get env() {
    return this.configService.get<AppEnv>('app.env');
  }

  get host() {
    return this.configService.get<string>('app.host');
  }

  get port() {
    return this.configService.get<number>('app.port');
  }

  get isDevelopment() {
    return this.env === AppEnv.development;
  }

  get isProduction() {
    return this.env === AppEnv.production;
  }

  get isTest() {
    return this.env === AppEnv.test;
  }
}

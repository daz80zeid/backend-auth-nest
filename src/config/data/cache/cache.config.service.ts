import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CacheConfigService {
  constructor(private readonly configService: ConfigService) {}

  get ttl() {
    return this.configService.get<number>('data.cache.ttl');
  }
}

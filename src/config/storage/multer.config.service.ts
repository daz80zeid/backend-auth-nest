import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MulterConfigService {
  constructor(private readonly configService: ConfigService) {}

  get configMulter() {
    return this.configService.get<object>('storage.multer');
  }

  get storage() {
    return this.configService.get<object>('storage.multer.storage');
  }

  get limits() {
    return this.configService.get<object>('storage.multer.limits');
  }
}

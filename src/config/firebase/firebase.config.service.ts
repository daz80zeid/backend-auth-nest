import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FirebaseConfigService {
  constructor(private readonly configService: ConfigService) {}

  get credentials() {
    return this.configService.get<object>('firebase.credentials');
  }
}

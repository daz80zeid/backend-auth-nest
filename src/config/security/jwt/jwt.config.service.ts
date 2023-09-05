import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtConfigService {
  constructor(private readonly configService: ConfigService) {}

  get algorithm() {
    return this.configService.get<string>('security.jwt.algorithm');
  }

  get secret() {
    return this.configService.get<string>('security.jwt.secret');
  }

  get privateKey() {
    return this.configService.get<string>('security.jwt.privateKey');
  }

  get publicKey() {
    return this.configService.get<string>('security.jwt.publicKey');
  }

  get expiresIn() {
    return this.configService.get<string>('security.jwt.expiresIn');
  }
}

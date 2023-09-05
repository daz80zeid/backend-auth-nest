import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from './firebase.config';
import { FirebaseConfigService } from './firebase.config.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
  ],
  providers: [ConfigService, FirebaseConfigService],
  exports: [ConfigService, FirebaseConfigService],
})
export class FirebaseConfigModule {}

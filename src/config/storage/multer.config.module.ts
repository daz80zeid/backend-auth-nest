import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from './multer.config';
import { MulterConfigService } from './multer.config.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
  ],
  providers: [ConfigService, MulterConfigService],
  exports: [ConfigService, MulterConfigService],
})
export class MulterConfigModule {}

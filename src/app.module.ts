import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PostgresConfigService } from './config/data/postgres/postgres.config.service';
import { AppConfigModule } from './config/app/app.config.module';
import { PostgresConfigModule } from './config/data/postgres/postgres.config.module';
import { UserModule } from './users/user.module';
import { FirebaseModule as FirebaseAuthModule } from './users/auth/firebase/firebase.module';
import { FileModule } from './files/file.module';
import { AuthModule } from './users/auth/auth.module';
import { MailerModule } from './users/auth/mailer/mailer.module';
import { AuthCodeModule } from './users/auth/code/auth.code.module';
import { AuthTokenModule } from './users/auth/token/auth.token.module';

@Module({
  imports: [
    AppConfigModule,
    UserModule,
    AuthModule,
    AuthCodeModule,
    AuthTokenModule,
    FirebaseAuthModule,
    FileModule,
    MailerModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [PostgresConfigModule],
      inject: [PostgresConfigService],
      useFactory: (postgresConfigService: PostgresConfigService) => ({
        type: 'postgres',
        url: postgresConfigService.uri,
        synchronize: true,
        entities: [join(__dirname, '**/**.entity{.ts,.js}')],
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

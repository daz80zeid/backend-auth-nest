import { Global, Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { FirebaseController } from './firebase.controller';
import { AuthService } from '../auth.service';
import { UserService } from '../../user.service';
import { FirebaseConfigModule } from '../../../config/firebase/firebase.config.module';

@Global()
@Module({
  imports: [FirebaseConfigModule],
  providers: [FirebaseService, AuthService, UserService],
  controllers: [FirebaseController],
})
export class FirebaseModule {}

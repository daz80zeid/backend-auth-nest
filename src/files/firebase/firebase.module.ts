import { Global, Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { FirebaseConfigModule } from '../../config/firebase/firebase.config.module';

@Global()
@Module({
  imports: [FirebaseConfigModule],
  providers: [FirebaseService],
})
export class FirebaseModule {}

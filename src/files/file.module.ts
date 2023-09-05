import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { FirebaseService } from './firebase/firebase.service';
import { FirebaseModule as FirebaseFileModule } from './firebase/firebase.module';

@Module({
  imports: [FirebaseFileModule],
  providers: [FileService, FirebaseService],
  controllers: [FileController],
})
export class FileModule {}

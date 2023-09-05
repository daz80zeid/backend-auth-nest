import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FirebaseConfigService } from 'src/config/firebase/firebase.config.service';
import App = admin.app.App;
import { NewFileInput } from '../input/new.file.input';
import { env } from 'process';
export type FirebaseApp = App;

@Injectable()
export class FirebaseService {
  firebaseApp: FirebaseApp;

  constructor(private readonly firebaseConfigService: FirebaseConfigService) {}

  initializeApp(): FirebaseApp {
    if (this.firebaseApp) {
      return this.firebaseApp;
    }

    this.firebaseApp = admin.initializeApp(
      {
        credential: admin.credential.cert(this.getFirebaseCredentials()),
        databaseURL: 'https://nestjs-auth-3168e.firebaseio.com',
        storageBucket: 'nestjs-auth-3168e.appspot.com/',
      },
      Date.now().toString(),
    );
    return this.firebaseApp;
  }

  private getFirebaseCredentials() {
    return this.firebaseConfigService.credentials;
  }

  async uploadFirebase(file: NewFileInput): Promise<string> {
    const pathToFile = await this.getPathFile(file);

    await this.initializeApp().storage().bucket().upload(pathToFile);

    return `https://firebasestorage.googleapis.com/v0/b/${env.FIREBASE_PROJECT_ID}.appspot.com/o/${file.filename}?alt=media`;
  }

  async getPathFile(file: NewFileInput): Promise<string> {
    const fileDestination = file.destination;

    const path = [
      __dirname,
      '../../..',
      fileDestination.substr(2, fileDestination.length - 1),
      file.filename,
    ];

    return path.join('/');
  }

  async deleteFileFirebase(file): Promise<any> {
    await this.initializeApp().storage().bucket().file(file).delete();
  }
}

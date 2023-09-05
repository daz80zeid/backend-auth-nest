import {
  HttpStatus,
  Injectable,
  Response,
} from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FirebaseConfigService } from 'src/config/firebase/firebase.config.service';
import { AppConfigService } from '../../../config/app/app.config.service';
import { Provider } from '../../enums/provider.enum';
import { User } from '../../entities/user.entity';
import { AuthMethodsEnum } from '../../enums/auth.methods.enum';
import App = admin.app.App;
import UserRecord = admin.auth.UserRecord;
import { AuthService } from '../auth.service';

export type FirebaseUserRecord = UserRecord;
export type FirebaseApp = App;

type OutputToken = {
  expires_in: number;
  token: string;
  userId: { id: string };
};

@Injectable()
export class FirebaseService {
  firebaseApp: FirebaseApp;

  constructor(
    private readonly firebaseConfigService: FirebaseConfigService,
    private readonly authService: AuthService,
    private readonly appConfig: AppConfigService,
  ) {}

  initializeApp(): FirebaseApp {
    if (this.firebaseApp) {
      return this.firebaseApp;
    }

    this.firebaseApp = admin.initializeApp(
      {
        credential: admin.credential.cert(this.getFirebaseCredentials()),
      },
      Date.now().toString(),
    );
    return this.firebaseApp;
  }

  private getFirebaseCredentials() {
    return this.firebaseConfigService.credentials;
  }

  async getUserFirebase(accessToken: string): Promise<FirebaseUserRecord> {
    let uid: string;

    if (!this.isUID(accessToken)) {
      uid = await this.authByIdToken(accessToken);
    } else {
      if (this.appConfig.isProduction) {
        throw new Error('Your are not granted to use this auth method');
      }
    }

    let userRecord: FirebaseUserRecord;

    try {
      userRecord = await this.authByUid(uid);
      return userRecord;
    } catch (e) {
      const message = this.appConfig.isDevelopment ? e.message : undefined;

      throw new Error(message);
    }
  }

  async auth(
    @Response() res,
    idToken: string,
  ): Promise<OutputToken> {
    const userGetResponse = await this.getUserFirebase(idToken);
    const user = await this.findOrUpsertUser(userGetResponse);

    return res.status(HttpStatus.OK).json(await this.authService.createToken(user.id));
  }

  isUID(input: string): boolean {
    return input && input.length <= 128;
  }

  async authByUid(uid: string): Promise<FirebaseUserRecord> {
    return this.initializeApp().auth().getUser(uid);
  }

  async authByIdToken(accessToken: string): Promise<string> {
    let decodedIdToken;

    try {
      decodedIdToken = await this.initializeApp().auth().verifyIdToken(accessToken, true);
    } catch (e) {
      let message;
      if (e.code === 'auth/id-token-revoked') {
        message = this.appConfig.isDevelopment
          ? e.message
          : 'Token has been revoked';
      } else {
        message = this.appConfig.isDevelopment
          ? e.message
          : 'Token is invalid.';
      }

      throw new Error(message);
    }

    return decodedIdToken.uid;
  }

  private async findOrUpsertUser(
    userRecord: FirebaseUserRecord,
  ): Promise<User> {
    const foundUser = await User.findOne({
      where: {
        uid: userRecord.uid,
      },
    });

    if (!foundUser) {
      return this.createUserFromFirebase(userRecord);
    } else {
      return foundUser;
    }
  }

  async createUserFromFirebase(userRecord: UserRecord): Promise<User> {
    const newUser = new User();
    const defaulrPhotoUrl = 'https://firebasestorage.googleapis.com/v0/b/fight-club-eaef9.appspot.com/o/user.png?alt=media';
    const providerId = userRecord.providerData[0]?.providerId;

    newUser.uid = userRecord.uid;
    newUser.email = userRecord.email;
    newUser.emailVerified = userRecord.emailVerified;
    newUser.displayName = userRecord.displayName;
    newUser.phoneNumber = userRecord.phoneNumber;
    newUser.photoURL = userRecord.photoURL ?? defaulrPhotoUrl;
    newUser.rawProviderData = userRecord;
    newUser.provider = Provider.FIREBASE;

    if (providerId) {
      switch (providerId) {
        case 'facebook.com':
          newUser.authMethod = AuthMethodsEnum.FACEBOOK;
          break;
        case 'google.com':
          newUser.authMethod = AuthMethodsEnum.GOOGLE;
          break;
        case 'apple.com':
          newUser.authMethod = AuthMethodsEnum.APPLE;
          break;
        case 'phone':
          newUser.authMethod = AuthMethodsEnum.PHONE;
          break;
        default:
          newUser.authMethod = null;
      }
    }

    await newUser.save();

    return newUser;
  }
}

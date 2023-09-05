import {
  HttpStatus,
  Injectable,
  Response,
} from '@nestjs/common';
import { FirebaseService } from './firebase/firebase.service';
import { File } from './entities/file.entity';
import { User } from '../users/entities/user.entity';
import * as fs from 'fs';
import { NewFileInput } from './input/new.file.input';

@Injectable()
export class FileService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async uploadFile(file: NewFileInput, user: User, @Response() res: any): Promise<File | string> {
    let pathToFileFirebase = '';

    try {
      pathToFileFirebase = await this.firebaseService.uploadFirebase(file);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json('File not upload');
    }

    const fileObject = await this.createFile(
      file,
      user.id,
      pathToFileFirebase,
    );

    return res.status(HttpStatus.OK).json(fileObject);
  }

  async deleteFileById(user: User, idFile: string, @Response() res: any): Promise<string> {
    const file = await this.getFileById(idFile);

    if (!file || file.userId !== user.id) {
      return res.status(HttpStatus.NOT_FOUND).json('Files of this user were not found');
    }

    await this.deleteFile(file);

    return res.status(HttpStatus.OK).json('File delete successfully');
  }

  async getAllFiles(user: User, @Response() res: any): Promise<Array<File> | string> {
    const files = await this.getAllFilesByUserId(user.id);

    if (!files[0]) {
      return res.status(HttpStatus.NOT_FOUND).json('Files not found');
    }

    return res.status(HttpStatus.OK).json(files);
  }

  async deleteAllFiles(user: User, @Response() res: any): Promise<string> {
    const files = await this.getAllFilesByUserId(user.id);

    if (!files[0]) {
      return res.status(HttpStatus.NOT_FOUND).json('Files not found');
    }

    for (const file of files) {
      await this.deleteFile(file);
    }

    return res.status(HttpStatus.OK).json('Delete all files successfully');
  }

  async deleteFile(file: File): Promise<void> {
    await this.firebaseService.deleteFileFirebase(file.name);
    await file.remove();
    await this.deleteFileLocalStorage(file.path);
  }

  async deleteFileLocalStorage(path: string): Promise<void> {
    return fs.unlink(path, (err) => {
      if (err) {
        console.error(err);
        return false;
      }

      return true;
    });
  }

  async getAllFilesByUserId(userId: string): Promise<Array<File> | null> {
    const files = await File.find({
      where: {
        userId: userId,
      },
    });

    return files;
  }

  async getFileById(fileId: string): Promise<File | null> {
    const file = await File.findOne({
      where: {
        id: fileId,
      },
    });

    return file;
  }

  async createFile(
    file: NewFileInput,
    userId: string,
    pathToFileFirebase: string,
  ): Promise<File> {
    const fileObject = new File();

    fileObject.path = await this.firebaseService.getPathFile(file);
    fileObject.name = file.filename;
    fileObject.type = file.type;
    fileObject.firebasePath = pathToFileFirebase;
    fileObject.originalName = file.originalname;
    fileObject.userId = userId;

    await fileObject.save();

    return fileObject;
  }
}

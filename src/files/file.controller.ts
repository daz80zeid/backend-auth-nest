import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Response,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { AuthGuard } from '../users/auth/guards/auth.guard';
import { User as UserDecorator } from '../users/decorators/user.decorator';
import { User } from '../users/entities/user.entity';
import { FileExtender } from './extenders/file.extender';
import { File } from './entities/file.entity';
import { NewFileInput } from './input/new.file.input';
import { multerLocalOptions } from '../config/storage/multer.config';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @ApiTags('File')
  @ApiOperation({ summary: 'Upload file' })
  @UseGuards(AuthGuard)
  @ApiBearerAuth('idToken')
  @ApiUnauthorizedResponse({ description: 'Unable to authorize in app' })
  @ApiOkResponse({
    status: 200,
    type: File,
    description: 'File upload successfully',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'File not upload',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        type: { type: 'string' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('uploadFile')
  @UseInterceptors(FileExtender)
  @UseInterceptors(FileInterceptor('file', multerLocalOptions))
  async uploadFile(
    @UserDecorator() user: User,
    @Response() res: any,
    @UploadedFile() file: NewFileInput,
  ): Promise<File | string> {
    return this.fileService.uploadFile(file, user, res);
  }

  @ApiTags('File')
  @ApiOperation({ summary: 'Delete file' })
  @UseGuards(AuthGuard)
  @ApiBearerAuth('idToken')
  @ApiUnauthorizedResponse({ description: 'Unable to authorize in app' })
  @ApiOkResponse({
    status: 200,
    description: 'File delete successfully',
  })
  @ApiBadRequestResponse({
    status: 404,
    description: 'Files of this user were not found',
  })
  @Delete('deleteFile/:id')
  async deleteFile(
    @UserDecorator() user: User,
    @Param('id') idFile: string,
    @Response() res: any,
  ): Promise<string> {
    return this.fileService.deleteFileById(user, idFile, res);
  }

  @ApiTags('File')
  @ApiOperation({ summary: 'Get all files' })
  @UseGuards(AuthGuard)
  @ApiBearerAuth('idToken')
  @ApiUnauthorizedResponse({ description: 'Unable to authorize in app' })
  @ApiOkResponse({
    status: 200,
    type: [File],
    description: 'Get all files successfully',
  })
  @ApiBadRequestResponse({
    status: 404,
    description: 'Files not found',
  })
  @Get('getAllFiles')
  async getAllFiles(
    @UserDecorator() user: User,
    @Response() res: any,
  ): Promise<Array<File> | string> {
    return this.fileService.getAllFiles(user, res);
  }

  @ApiTags('File')
  @ApiOperation({ summary: 'Delete all files' })
  @UseGuards(AuthGuard)
  @ApiBearerAuth('idToken')
  @ApiUnauthorizedResponse({ description: 'Unable to authorize in app' })
  @ApiOkResponse({
    status: 200,
    type: [File],
    description: 'Delete all files successfully',
  })
  @ApiBadRequestResponse({
    status: 404,
    description: 'Files not found',
  })
  @Delete('deleteAllFiles')
  async deleteAllFiles(
    @UserDecorator() user: User,
    @Response() res: any,
  ): Promise<string> {
    return this.fileService.deleteAllFiles(user, res);
  }
}

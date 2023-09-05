import { registerAs } from '@nestjs/config';
import { diskStorage } from 'multer';

export const config = registerAs('storage.multer', () => multerLocalOptions);

export const editFileName = (req, file, callback) => {
  const splitOriginName = file.originalname.split('.');
  const name = splitOriginName[0];
  const fileExtName = '.' + splitOriginName[splitOriginName.length - 1];
  const date = new Date();
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = ('0' + (date.getSeconds() + 1)).slice(-2);
  callback(
    null,
    `${name}-${year}-${month}-${day}-${hours}:${minutes}:${seconds}${fileExtName}`,
  );
};

export const multerLocalOptions = {
  storage: diskStorage({
    destination: './public/storage',
    filename: editFileName,
  }),
  limits: {
    /** Max field name size (Default: 100 bytes) */
    // fieldNameSize: number,
    /** Max field value size (Default: 1MB) */
    // fieldSize: number,
    /** Max number of non- file fields (Default: Infinity) */
    // fields: number,
    /** For multipart forms, the max file size (in bytes)(Default: Infinity) */
    fileSize: 5000000,
    /** For multipart forms, the max number of file fields (Default: Infinity) */
    files: 10,
    /** For multipart forms, the max number of parts (fields + files)(Default: Infinity) */
    // parts: number,
    /** For multipart forms, the max number of header key=> value pairs to parse Default: 2000(same as node's http). */
    // headerPairs: number,
  },
};

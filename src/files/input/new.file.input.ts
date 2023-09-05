import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class NewFileInput {
  @ApiModelProperty({ required: true, maxLength: 100 })
  fieldname: string;

  @ApiModelProperty({ required: true, maxLength: 255 })
  originalname: string;

  @ApiModelProperty({ required: true, maxLength: 255 })
  encoding: string;

  @ApiModelProperty({ required: true, maxLength: 255 })
  mimetype: string;

  @ApiModelProperty({ required: true, maxLength: 255 })
  destination: string;

  @ApiModelProperty({ required: true, maxLength: 255 })
  filename: string;

  @ApiModelProperty({ required: true, maxLength: 255 })
  path: string;

  @ApiModelProperty({ required: true, maxLength: 255 })
  size: number;

  @ApiModelProperty({ required: false, maxLength: 255 })
  type: string;
}

import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class CheckCodeInput {
  @ApiModelProperty({ required: true, maxLength: 100 })
  email: string;

  @ApiModelProperty({ required: true, maxLength: 255 })
  code: string;
}

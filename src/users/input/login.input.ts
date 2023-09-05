import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class LoginInput {
  @ApiModelProperty({ required: true, maxLength: 255 })
  email: string;

  @ApiModelProperty({ required: true, maxLength: 255 })
  password: string;
}

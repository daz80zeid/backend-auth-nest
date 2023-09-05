import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class UserVerifyEmailCodeInput {
  @ApiModelProperty({ required: true, maxLength: 100 })
  code: string;

  @ApiModelProperty({ required: true, maxLength: 100 })
  email: string;
}

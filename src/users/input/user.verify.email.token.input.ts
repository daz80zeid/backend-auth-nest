import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class UserVerifyEmailTokenInput {
  @ApiModelProperty({ required: true, maxLength: 255 })
  token: string;
}

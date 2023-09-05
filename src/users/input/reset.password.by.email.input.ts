import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class ResetPasswordByEmailInput {
  @ApiModelProperty({ required: true, maxLength: 255 })
  password: string;
}

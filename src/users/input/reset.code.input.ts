import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class ResetCodeInput {
  @ApiModelProperty({ required: true, maxLength: 100 })
  email: string;
}

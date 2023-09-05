import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class ResetTokenInput {
  @ApiModelProperty({ required: true, maxLength: 100 })
  email: string;
}

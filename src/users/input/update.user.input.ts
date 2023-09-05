import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class UpdateUserInput {
  @ApiModelProperty({ required: true, maxLength: 255 })
  last_name?: string;

  @ApiModelProperty({ required: true, maxLength: 255 })
  first_name?: string;

  @ApiModelProperty({ required: true, maxLength: 255 })
  phoneNumber?: string;
}

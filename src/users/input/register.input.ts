import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class RegisterInput {
  @ApiModelProperty({ required: true, maxLength: 255 })
  email: string;

  @ApiModelProperty({ required: true, maxLength: 255 })
  password: string;

  @ApiModelProperty({ required: true, maxLength: 255 })
  last_name: string;

  @ApiModelProperty({ required: true, maxLength: 255 })
  first_name: string;
}

import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class LoginGoogleInput {
  @ApiModelProperty({ required: true })
  token: string;
}

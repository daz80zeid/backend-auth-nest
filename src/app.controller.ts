import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiTags('Home')
  @ApiOperation({
    summary: 'Home, sweet home',
  })
  getHello(): string {
    return this.appService.getHello();
  }
}

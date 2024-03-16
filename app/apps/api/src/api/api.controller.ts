import { dalExample } from '@app/dal/index';
import { Controller, Get } from '@nestjs/common';

@Controller('api')
export class ApiController {
  @Get('test')
  async test() {
    dalExample();
  }
}

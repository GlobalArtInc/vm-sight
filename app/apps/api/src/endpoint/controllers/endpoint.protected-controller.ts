import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { EndpointService } from '../endpoint.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserId } from '../../auth/decorators/user-id.decorator';
import { Auth } from '../../auth/decorators/auth.decorator';
import { CreateEndpointDto, EndpointExecuteDto } from '../dtos';

@Controller({
  version: 'protected',
  path: 'endpoint',
})
@ApiTags('endpoint')
@Auth()
export class EndpointControllerProtected {
  constructor(private readonly endpointService: EndpointService) {}

  @ApiOperation({
    summary: 'Get all endpoints',
  })
  @Get()
  async get(@UserId() userId: number) {
    return this.endpointService.getAllByUserId(userId);
  }

  @ApiOperation({
    summary: 'Create endpoint',
  })
  @Post()
  async create(@Body() data: CreateEndpointDto, @UserId() userId: number) {
    await this.endpointService.create(data, userId);
  }

  @ApiOperation({
    summary: 'Exec',
  })
  @Post(':endpointId/exec')
  async execute(@Param('endpointId', ParseIntPipe) endpointId: number, @Body() data: EndpointExecuteDto) {
    return this.endpointService.execute(endpointId, data);
  }
}

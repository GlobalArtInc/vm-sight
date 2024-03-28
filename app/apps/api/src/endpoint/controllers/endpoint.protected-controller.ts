import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { EndpointService } from '../endpoint.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserId } from '../../auth/decorators/user-id.decorator';
import { Auth } from '../../auth/decorators/auth.decorator';
import { CreateEndpointDto, EndpointExecuteDto } from '../dtos';
import { GetDataWithFilterDto } from '@app/shared/dtos';
import { EndpointEntity } from '@app/dal/repositories/endpoint';

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
  async get(@UserId() userId: number, @Query() data: GetDataWithFilterDto<EndpointEntity>) {
    return this.endpointService.getAllByUserId(userId, data);
  }

  @ApiOperation({
    summary: 'Get endpoint by id',
  })
  @Get(':endpointId')
  async getOne(@Param('endpointId', ParseIntPipe) endpointId: number) {
    return this.endpointService.getOneById(endpointId);
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

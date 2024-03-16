import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsDefined, IsNumber, IsOptional, IsString, Max } from 'class-validator';
import { FilterQueryDto } from './filter-query.dto';
import { MAX_QUERY_LIMIT } from '../constants';
import { BaseEntity } from '@app/dal/repositories';
import { OrderValue } from '../types';
import { transformToFilterQueryDto } from '../transformers';

export class GetDataWithFilterDto<T extends BaseEntity> {
  @ApiPropertyOptional()
  @Transform(({ value }: TransformFnParams) => +value)
  @IsNumber()
  @Max(MAX_QUERY_LIMIT)
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional()
  @Transform(({ value }: TransformFnParams) => +value)
  @IsNumber()
  @IsOptional()
  offset?: number;

  @ApiPropertyOptional({
    name: 'filter',
    type: String,
    isArray: true,
    example: ['name||$eq||something', 'createdAt||$between||2022-12-12,2023-12-12'],
  })
  @Transform(({ value }: { value: string | string[] }) => transformToFilterQueryDto<T>(value))
  @IsDefined()
  @IsOptional()
  filter: FilterQueryDto<T>[] = [];

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  orderBy?: OrderValue;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  sortBy?: keyof T;
}

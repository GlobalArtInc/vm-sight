import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { BeforeInsert } from 'typeorm';

export class CreateDockerEndpointDto {
  @ApiProperty()
  @IsString()
  name: '';

  @ApiProperty()
  @IsNumber()
  type: number;

  @ApiProperty()
  @IsObject()
  config: string;

  @ApiPropertyOptional()
  @IsOptional()
  tempId?: number;
}

import { Body, Controller, Get, Post, Put, Delete, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AttachUser, GetUser } from 'src/common/decorators/auth.decorators';
import { CreateUserDto, InitAdminDto, UpdateUserDto } from './common/user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@ApiTags('users')
@Controller('users')
export class UserPublicController {
  constructor(private readonly service: UserService) {}

  @ApiOperation({
    summary: 'Check if admin account exists',
  })
  @Get('admin/check')
  checkAdmin() {
    return this.service.checkAdmin();
  }

  @ApiOperation({
    summary: 'Create an admin account if not exists',
  })
  @Post('admin/init')
  initAdmin(@Body() dto: InitAdminDto) {
    return this.service.initAdmin(dto);
  }
}

@AttachUser()
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @ApiOperation({
    summary: 'Get all users',
  })
  @Get()
  getAllUsers() {
    return this.service.getUsers();
  }

  @ApiOperation({
    summary: 'Create a user',
  })
  @Post()
  createUser(@Body() dto: CreateUserDto) {
    return this.service.createUser(dto);
  }

  @ApiOperation({
    summary: 'Delete a user by ID',
  })
  @Delete(':id')
  deleteUser(@Param('id') id: number, @GetUser() user: User) {
    return this.service.deleteUser(user, id);
  }

  @ApiOperation({
    summary: 'Get user by ID',
  })
  @Get(':id')
  getUserById(@Param('id') id: number) {
    return this.service.getUserById(id);
  }

  @ApiOperation({
    summary: 'Update user by ID',
  })
  @Put(':id')
  updateUserById(@Param('id') id: number, @Body() dto: UpdateUserDto) {
    return this.service.updateUserById(id, dto);
  }
}

import { Controller, Get, Post, Body, Param, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dtos/user.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('seed')
  async seedTestUser() {
    try {
      const testUser = await this.usersService.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });
      return { success: true, user: { id: testUser.id, email: testUser.email, username: testUser.username } };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  @Post('fix-avatars')
  async fixAvatars() {
    try {
      const result = await this.usersService.fixInvalidAvatars();
      return { success: true, message: `Fixed ${result.fixed} avatars` };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    };
  }

  @Get('all')
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      status: user.status,
      isOnline: user.isOnline,
    }));
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      status: user.status,
      isOnline: user.isOnline,
    };
  }

  @Put(':id')
  @UseGuards(JwtGuard)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() user: any,
  ) {
    if (user.sub !== id) {
      return { error: 'Unauthorized' };
    }

    const updatedUser = await this.usersService.update(id, updateUserDto);
    return {
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      status: updatedUser.status,
    };
  }
}

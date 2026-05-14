import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User } from './schemas/user.schema';
import { CreateUserDto, UpdateUserDto } from './dtos/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, username, password, avatar } = createUserDto;

    const existingUser = await this.userModel.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const colors = ['FF6B6B', '4ECDC4', '45B7D1', 'FFA07A', '98D8C8', 'F7DC6F', 'BB8FCE', '85C1E2', 'F8B88B', '52C4B3'];
    const hash = username.charCodeAt(0) + username.charCodeAt(username.length - 1);
    const color = colors[hash % colors.length];
    const avatarUrl = avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=${color}&color=fff&size=40&font-size=0.4`;

    const user = new this.userModel({
      email,
      username,
      password: hashedPassword,
      avatar: avatarUrl,
    });

    return user.save();
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async setUserOnline(id: string): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { isOnline: true, status: 'online' },
      { new: true },
    );
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async setUserOffline(id: string): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { isOnline: false, status: 'offline' },
      { new: true },
    );
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async fixInvalidAvatars(): Promise<{ fixed: number }> {
    const users = await this.userModel.find();
    let fixedCount = 0;

    for (const user of users) {
      // Si el avatar contiene example.com o no es una URL válida, regenerarlo
      if (!user.avatar || user.avatar.includes('example.com') || !user.avatar.startsWith('http')) {
        const colors = ['FF6B6B', '4ECDC4', '45B7D1', 'FFA07A', '98D8C8', 'F7DC6F', 'BB8FCE', '85C1E2', 'F8B88B', '52C4B3'];
        const hash = user.username.charCodeAt(0) + user.username.charCodeAt(user.username.length - 1);
        const color = colors[hash % colors.length];
        const newAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=${color}&color=fff&size=40&font-size=0.4`;
        
        await this.userModel.findByIdAndUpdate(user.id, { avatar: newAvatarUrl });
        fixedCount++;
      }
    }

    return { fixed: fixedCount };
  }
}

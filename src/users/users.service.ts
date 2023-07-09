import { Injectable, NotFoundException } from '@nestjs/common';
import CreateUserDto from './dto/create-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  
  async create(createUserDto: CreateUserDto) {
    return this.userModel.create(createUserDto);
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id)
    if (!user) {
        throw new NotFoundException(`User not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({email})
    if (!user) {
        throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async deleteOne(id: string) {
    return await this.userModel.deleteOne({_id: id}) 
  }

  async updateStatus(id: string, status: 'Active' | 'Pending'): Promise<UserDocument> {
    const user = await this.userModel.findByIdAndUpdate(id, { status }, { new: true });
    if (!user) {
        throw new NotFoundException(`User not found`);
    }
    return user;
  }

  async updatePassword(id: string, password: string): Promise<UserDocument> {
    const user = await this.userModel.findByIdAndUpdate(id, { password }, { new: true });
    if (!user) {
        throw new NotFoundException(`User not found`);
    }
    return user;
  }
}

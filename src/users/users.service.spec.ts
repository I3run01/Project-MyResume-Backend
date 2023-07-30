import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import CreateUserDto from './dto/create-user.dto';
import { NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';

describe('UsersService', () => {
  let service: UsersService;
  let userModel: Model<UserDocument>;

  const mockUserDto: CreateUserDto = {
    email: 'test@test.com',
    password: 'password',
    name: 'Test User',
    avatarImage: 'test.png',
    status: 'Active',
  };

  const mockUser: UserDocument = {
    _id: new Types.ObjectId(),
    ...mockUserDto,
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: {
            new: jest.fn().mockResolvedValue(userModel),
            constructor: jest.fn().mockResolvedValue(userModel),
            findById: jest.fn(),
            findOne: jest.fn(),
            deleteOne: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get<Model<UserDocument>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
 
    it('should create a user', async () => {
      jest.spyOn(userModel, 'create').mockResolvedValueOnce(mockUser as any);

      const result = await service.create(mockUserDto);
  
      expect(userModel.create).toHaveBeenCalledWith(mockUserDto);
      expect(result).toEqual(mockUser);
    });
  });

  describe('findById', () => { 
    it('should find a user by id', async () => {
      const id = mockUser._id.toHexString();
  
      jest.spyOn(userModel, 'findById').mockResolvedValueOnce(mockUser);
      
      const result = await service.findById(id);
  
      expect(userModel.findById).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockUser);
    });
  
    it('should throw NotFoundException when user not found', async () => {
      const id = 'some-nonexistent-id';
  
      jest.spyOn(userModel, 'findById').mockResolvedValueOnce(null);
  
      await expect(service.findById(id)).rejects.toThrow(new NotFoundException('User not found'));
    });
  });

  describe('findByEmail', () => { 
    it('should find a user by email', async () => {
      const email = mockUserDto.email;
  
      jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(mockUser);
  
      const result = await service.findByEmail(email);
  
      expect(userModel.findOne).toHaveBeenCalledWith({email});
      expect(result).toEqual(mockUser);
    });
  
    it('should throw NotFoundException when user not found', async () => {
      const email = 'nonexistent@test.com';
  
      jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(null);
  
      await expect(service.findByEmail(email)).rejects.toThrow(new NotFoundException(`User with email ${email} not found`));
    });
  });

  describe('deleteOne', () => {
    it('should delete a user by id', async () => {
      const id = mockUser._id.toHexString();
  
      jest.spyOn(userModel, 'deleteOne').mockResolvedValueOnce({ deletedCount: 1 } as any);
  
      const result = await service.deleteOne(id);
  
      expect(userModel.deleteOne).toHaveBeenCalledWith({_id: id});
      expect(result.deletedCount).toEqual(1);
    });
  });

  describe('updateStatus', () => {
    it('should update a user status', async () => {
      const id = mockUser._id.toHexString();
      const newStatus = 'Pending';
  
      jest.spyOn(userModel, 'findByIdAndUpdate').mockResolvedValueOnce({ ...mockUser, status: newStatus });
  
      const result = await service.updateStatus(id, newStatus);
  
      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(id, { status: newStatus }, { new: true });
      expect(result.status).toEqual(newStatus);
    });
  
    it('should throw NotFoundException when user not found', async () => {
      const id = 'nonexistent-id';
      const newStatus = 'Pending';
  
      jest.spyOn(userModel, 'findByIdAndUpdate').mockResolvedValueOnce(null);
  
      await expect(service.updateStatus(id, newStatus)).rejects.toThrow(new NotFoundException('User not found'));
    });
  });

  describe('updatePassword', () => {
    it('should update a user password', async () => {
      const id = mockUser._id.toHexString();
      const newPassword = 'newPassword';
  
      jest.spyOn(userModel, 'findByIdAndUpdate').mockResolvedValueOnce({ ...mockUser, password: newPassword });
  
      const result = await service.updatePassword(id, newPassword);
  
      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(id, { password: newPassword }, { new: true });
      expect(result.password).toEqual(newPassword);
    });
  
    it('should throw NotFoundException when user not found', async () => {
      const id = 'nonexistent-id';
      const newPassword = 'newPassword';
  
      jest.spyOn(userModel, 'findByIdAndUpdate').mockResolvedValueOnce(null);
  
      await expect(service.updatePassword(id, newPassword)).rejects.toThrow(new NotFoundException('User not found'));
    });
  });
    
});

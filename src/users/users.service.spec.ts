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
});

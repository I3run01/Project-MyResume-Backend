import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import CreateUserDto from './dto/create-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { getModelToken } from '@nestjs/mongoose';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('signUp', () => {
    it('should sign up a user', async () => {
      const userDto: CreateUserDto = {
        email: 'test@test.com',
        password: 'password',
        name: 'Test User',
        avatarImage: 'test.png',
        status: 'Active',
      };

      const hashedPassword = await bcrypt.hash(userDto.password, 10);
      const newUser: UserDocument = { _id: 'some-id', ...userDto, password: hashedPassword } as any;
      jest.spyOn(usersService, 'findByEmail').mockResolvedValueOnce(null);
      jest.spyOn(usersService, 'create').mockResolvedValueOnce(newUser);

      const result = await usersController.signUp(userDto, { headers: {} } as any);

      expect(result).toEqual(newUser);
    });

    it('should throw BadRequestException when user already exists', async () => {
      const userDto: CreateUserDto = {
        email: 'test@test.com',
        password: 'password',
        name: 'Test User',
        avatarImage: 'test.png',
        status: 'Active',
      };

      const existingUser: UserDocument = { _id: 'some-id', ...userDto } as any;
      jest.spyOn(usersService, 'findByEmail').mockResolvedValueOnce(existingUser);

      await expect(usersController.signUp(userDto, { headers: {} } as any)).rejects.toThrow(BadRequestException);
    });

    it('should throw UnauthorizedException when user status is not active', async () => {
      const userDto: CreateUserDto = {
        email: 'test@test.com',
        password: 'password',
        name: 'Test User',
        avatarImage: 'test.png',
        status: 'Pending',
      };

      const pendingUser: UserDocument = { _id: 'some-id', ...userDto } as any;
      jest.spyOn(usersService, 'findByEmail').mockResolvedValueOnce(pendingUser);

      await expect(usersController.signUp(userDto, { headers: {} } as any)).rejects.toThrow(UnauthorizedException);
    });
  });
});

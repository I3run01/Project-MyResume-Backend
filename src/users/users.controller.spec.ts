import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import CreateUserDto from './dto/create-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { getModelToken } from '@nestjs/mongoose';
import { UnauthorizedException, BadRequestException, NotFoundException} from '@nestjs/common';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUserDto: CreateUserDto = {
    email: 'test@test.com',
    password: 'password',
    name: 'Test User',
    avatarImage: 'test.png',
    status: 'Active',
  };

  const response = {
    cookie: jest.fn(),
  } as unknown as Response;

  const mockUser: UserDocument = {
    _id: new Types.ObjectId(),
    ...mockUserDto,
  } as any;

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
    it('should create a user', async () => {
      const hashedPassword = await bcrypt.hash(mockUser.password, 10);
      const newUser: UserDocument = { _id: mockUser._id, ...mockUserDto, password: hashedPassword } as any;

      jest.spyOn(usersService, 'findByEmail').mockResolvedValueOnce(null);
      jest.spyOn(usersService, 'create').mockResolvedValueOnce(newUser);

      const result = await usersController.signUp(mockUserDto, { headers: {} } as any);

      expect(result).toEqual(newUser);
    });

    it('should throw BadRequestException when user already exists', async () => {

      const existingUser: UserDocument = { _id: mockUser._id, ...mockUserDto } as any;
      jest.spyOn(usersService, 'findByEmail').mockResolvedValueOnce(existingUser);

      await expect(usersController.signUp(mockUserDto, { headers: {} } as any)).rejects.toThrow(BadRequestException);
    });
  });

  describe('sigin', () => {
    it('should sign in an active user', async () => {
      const result = await usersController.signIn('test@test.com', 'password', response: Response);
    
      expect(response.cookie).toHaveBeenCalledWith('jwt', 'someToken', { sameSite: 'none', secure: true, httpOnly: true });
      expect(result).toEqual({ ...mockUser, password: null });
    });
    
    it('should throw NotFoundException if no user found', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValueOnce(null);
      await expect(usersController.signIn('test@test.com', 'password', response)).rejects.toThrow(NotFoundException);
    });
  })

 
});

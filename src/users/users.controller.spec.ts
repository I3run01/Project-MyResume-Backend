import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import CreateUserDto from './dto/create-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException, BadRequestException,NotFoundException} from '@nestjs/common';

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

      const result = await usersController.signUp(mockUserDto);

      expect(result).toEqual(newUser);
    });

    it('should throw BadRequestException when user already exists', async () => {
      const existingUser: UserDocument = { _id: mockUser._id, ...mockUserDto } as any;
      jest.spyOn(usersService, 'findByEmail').mockResolvedValueOnce(existingUser);

      await expect(usersController.signUp(mockUserDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw UnauthorizedException when user status is not active', async () => {
      const pendingUser: UserDocument = { _id: mockUser._id, ...mockUserDto, status: 'Pending' } as any;
      jest.spyOn(usersService, 'findByEmail').mockResolvedValueOnce(pendingUser);

      await expect(usersController.signUp(mockUserDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('signIn', () => {
    const signInDto = { email: 'test@test.com', password: 'password' };
  
    const response = {
      cookie: jest.fn(),
    } as any;

    const mailServices = {
      sendConfirmationEmail: jest.fn(),
    };
  
    it('should sign in a user', async () => {
      const hashedPassword = await bcrypt.hash(signInDto.password, 10);
      const existingUser: UserDocument = { ...mockUser, password: hashedPassword } as any;
  
      jest.spyOn(usersService, 'findByEmail').mockResolvedValueOnce(existingUser);
      jest.spyOn(jwtService, 'sign').mockReturnValueOnce('token');
  
      const result = await usersController.signIn(signInDto.email, signInDto.password, response);
  
      expect(result).toEqual({ ...existingUser, password: null });
      expect(response.cookie).toBeCalledWith('jwt', 'token', { sameSite: 'none', secure: true, httpOnly: true });
    });
  
    it('should throw BadRequestException when email or password is not provided', async () => {
      await expect(usersController.signIn(null, null, response)).rejects.toThrow(BadRequestException);
    });
  
    it('should throw NotFoundException when no user is found', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValueOnce(null);
      jest.spyOn(mailServices, 'sendConfirmationEmail').mockImplementationOnce(() => {});
  
      await expect(usersController.signIn(signInDto.email, signInDto.password, response)).rejects.toThrow(NotFoundException);
    });
  
    it('should throw UnauthorizedException when password is incorrect', async () => {
      const hashedPassword = await bcrypt.hash('wrong-password', 10);
      const existingUser: UserDocument = { ...mockUser, password: hashedPassword } as any;
  
      jest.spyOn(usersService, 'findByEmail').mockResolvedValueOnce(existingUser);
      jest.spyOn(mailServices, 'sendConfirmationEmail').mockImplementationOnce(() => {});
  
      await expect(usersController.signIn(signInDto.email, signInDto.password, response)).rejects.toThrow(UnauthorizedException);
    });
  
    it('should throw UnauthorizedException when user status is not Active', async () => {
      const hashedPassword = await bcrypt.hash(signInDto.password, 10);
      const existingUser: UserDocument = { ...mockUser, password: hashedPassword, status: 'Pending' } as any;
  
      jest.spyOn(usersService, 'findByEmail').mockResolvedValueOnce(existingUser);
      jest.spyOn(mailServices, 'sendConfirmationEmail').mockImplementationOnce(() => {});
  
      await expect(usersController.signIn(signInDto.email, signInDto.password, response)).rejects.toThrow(UnauthorizedException);
    });
  });
  
});

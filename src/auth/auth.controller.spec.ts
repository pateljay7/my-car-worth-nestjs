import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { User } from 'src/database/entities/user.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeAuthService = {
      login: ({ email, password }) => {
        return Promise.resolve({
          user: {
            id: 1,
            email,
            password,
          } as User,
          accessToken: 'access_Token',
        });
      },
      signup: (data) => {
        const user = {
          id: Math.floor(Math.random() * 99999),
          ...data,
        } as User;
        return Promise.resolve(user);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: fakeAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('signup creates a new user', async () => {
    const createUserDto = {
      email: 'test@gmail.com',
      password: 'test@123',
      first_name: 'Test',
      last_name: 'User',
    };

    const user = await controller.signup(createUserDto);
    expect(user.email).toEqual(createUserDto.email);
    expect(user.first_name).toEqual(createUserDto.first_name);
    expect(user.last_name).toEqual(createUserDto.last_name);
  });

  it('signin updated session object and returns user', async () => {
    const session = {};
    const user = await controller.login(
      {
        email: 'jay@gmail.com',
        password: 'jay@123',
      },
      session,
    );

    expect(user.user.id).toBe(1);
    expect(session['user'].id).toBe(1);
    expect(session['accessToken']).toEqual('access_Token');
  });

  it('signout updates session object to null', () => {
    const session = {
      accessToken: 'accessToken',
      user: {
        email: 'jay@gmail.com',
        password: 'jay@123',
      },
    };
    controller.signout(session);
    expect(session.user).toBeNull();
  });
});

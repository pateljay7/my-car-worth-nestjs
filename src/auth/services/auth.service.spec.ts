import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../../users/users.service';
import { JwtStrategy } from '../jwt.strategy';
import { User } from 'src/database/entities/user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;
  beforeEach(async () => {
    //Create a fake copy of the usersService
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: ({ email, password, first_name, last_name }) => {
        const user = {
          id: Math.floor(Math.random() * 99999),
          email,
          password,
          first_name,
          last_name,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };
    const fakeJwtService = {
      generateToken: () => '',
    };

    //create testing module
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: JwtStrategy,
          useValue: fakeJwtService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('Can create as instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a hased password', async () => {
    const user = await service.signup({
      email: 'jay@gmail.com',
      password: 'jay@123',
      first_name: 'jay',
      last_name: 'Patel',
    });

    expect(user.password).not.toEqual('jay@123');
  });

  it('throws an error if user signs up with existing email', async () => {
    await service.signup({
      email: 'jay@gmail.com',
      password: 'jay@123',
      first_name: 'jay',
      last_name: 'Patel',
    });

    await expect(
      service.signup({
        email: 'jay@gmail.com',
        password: 'jay@123',
        first_name: 'jay',
        last_name: 'Patel',
      }),
    ).rejects.toThrow(new BadRequestException('Email is already registered.'));
  });

  it('throws if signin is called with as unused email', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([
        {
          id: 1,
          email: 'jaypatel@gmail.com',
          password: 'jay@123',
          first_name: 'jay',
          last_name: 'Patel',
        } as User,
      ]);

    await expect(
      service.login({
        email: 'jay@gmail.com',
        password: 'jay@123',
      }),
    ).rejects.toThrow(new NotFoundException('Invalid credential'));
  });

  it('throws if an invalid password is provided', async () => {
    await service.signup({
      email: 'jay@gmail.com',
      password: 'jay@123',
      first_name: 'jay',
      last_name: 'Patel',
    });

    await expect(
      service.login({
        email: 'jaypatel@gmail.com',
        password: 'jay@123',
      }),
    ).rejects.toThrow(new BadRequestException('Invalid credential'));
  });

  it('returns a user if correct password', async () => {
    await service.signup({
      email: 'jay@gmail.com',
      password: 'jay@123',
      first_name: 'jay',
      last_name: 'Patel',
    });
    const user = await service.login({
      email: 'jay@gmail.com',
      password: 'jay@123',
    });

    expect(user).toBeDefined();
    expect(user.user.email).toEqual('jay@gmail.com');
  });
});

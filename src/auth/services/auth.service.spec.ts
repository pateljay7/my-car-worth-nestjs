import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../../users/users.service';
import { JwtStrategy } from '../jwt.strategy';
import { User } from 'src/database/entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    //Create a fake copy of the usersService
    const fakeUsersService: Partial<UsersService> = {
      find: () => Promise.resolve([]),
      create: ({ email, password }) =>
        Promise.resolve({ id: 1, email, password } as User),
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
});

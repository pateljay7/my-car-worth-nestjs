import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from 'src/database/entities/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  beforeEach(async () => {
    let users: User[] = [];
    fakeUsersService = {
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
      findOne: (id: number) => {
        const user = users.find((user) => user.id === id);
        return Promise.resolve(user);
      },
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      remove: (id: number) => {
        const index = users.findIndex((user) => user.id === id);
        users.splice(index, 1);
        return Promise.resolve(users[index]);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: fakeUsersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with the given email', async () => {
    await fakeUsersService.create({
      email: 'jay@gmail.com',
      password: 'jay@123',
      first_name: 'jay',
      last_name: 'Patel',
    });

    const users = await controller.findAllUsers('jay@gmail.com');
    expect(users.length).toBe(1);
    expect(users[0].email).toEqual('jay@gmail.com');
  });

  it('findUser returns a single user with the given id', async () => {
    const user = await fakeUsersService.create({
      email: 'jay@gmail.com',
      password: 'jay@123',
      first_name: 'jay',
      last_name: 'Patel',
    });
    expect((await controller.findUser(user.id.toString())).email).toEqual(
      user.email,
    );
  });

  it('findUser throws an error if user with the given id is not found', async () => {
    await fakeUsersService.create({
      email: 'jay@gmail.com',
      password: 'jay@123',
      first_name: 'jay',
      last_name: 'Patel',
    });
    await expect(controller.findUser('123')).rejects.toThrow(
      new NotFoundException('user not found'),
    );
  });
});

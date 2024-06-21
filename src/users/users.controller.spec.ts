import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from 'src/database/entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dtos/update-user.dto';

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
        const user = users[index];
        if (index > -1) {
          users.splice(index, 1);
        }
        return Promise.resolve(user);
      },
      update: (id: number, updateUserDto: Partial<User>) => {
        const user = users.find((user) => user.id === id);
        if (!user) return Promise.resolve(null);
        Object.assign(user, updateUserDto);
        return Promise.resolve(user);
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

  it('whoami returns the currently authenticated user based on session', async () => {
    const user = await fakeUsersService.create({
      email: 'jay@gmail.com',
      password: 'jay@123',
      first_name: 'jay',
      last_name: 'Patel',
    });
    const session = { user: { id: user.id } };
    const currentUser = await controller.whoami(session);
    expect(currentUser).toEqual(user);
  });

  it('whoami throws an error if user with the given session id is not found', async () => {
    const session = { user: { id: 12345 } };
    await expect(controller.whoami(session)).rejects.toThrow(
      new NotFoundException('user not found'),
    );
  });

  it('removeUser deletes the user with the given id', async () => {
    const user = await fakeUsersService.create({
      email: 'jay@gmail.com',
      password: 'jay@123',
      first_name: 'jay',
      last_name: 'Patel',
    });
    await controller.removeUser(user.id.toString());
    const foundUser = await fakeUsersService.findOne(user.id);
    expect(foundUser).toBeUndefined();
  });
  it('updateUser updates the user with the given id', async () => {
    const user = await fakeUsersService.create({
      email: 'jay@gmail.com',
      password: 'jay@123',
      first_name: 'jay',
      last_name: 'Patel',
    });
    const updateUserDto = { first_name: 'UpdatedName' };
    const updatedUser = await controller.updateUser(
      user.id.toString(),
      updateUserDto as UpdateUserDto,
    );
    expect(updatedUser.first_name).toEqual('UpdatedName');
  });
});

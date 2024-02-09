import { Global, Module } from '@nestjs/common';
import { DataSource } from 'typeorm';

const databaseProviders = [
  {
    provide: DataSource,
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        database: process.env.DATABASE_NAME,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        synchronize: process.env.NODE_ENV === 'Development' ? true : false,
        entities: [__dirname + '/entities/*.entity{.ts,.js}'],
      });
      return dataSource.initialize();
    },
  },
];
@Global()
@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}

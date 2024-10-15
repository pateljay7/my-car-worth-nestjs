import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

// Create a function to initialize the DataSource
const createDataSource = (configService: ConfigService) => {
  // const isDevelopment = configService.get<string>('NODE_ENV') === 'development';

  return new DataSource({
    type: 'postgres',
    host: configService.get<string>('DATABASE_HOST'),
    port: configService.get<number>('DATABASE_PORT'),
    database: configService.get<string>('DATABASE_NAME'),
    username: configService.get<string>('DATABASE_USER'),
    password: configService.get<string>('DATABASE_PASSWORD'),
    synchronize: false,
    entities: [__dirname + '/entities/*.entity{.ts,.js}'],
    migrations: [__dirname + '/migrations/*{.ts,.js}'],
  });
};

// Database provider
export const databaseProviders = [
  {
    provide: DataSource,
    useFactory: async (configService: ConfigService) => {
      const dataSource = createDataSource(configService);
      return dataSource.initialize();
    },
    inject: [ConfigService],
  },
];

// Exported DataSource instance for migration generation
export const dataSource = createDataSource(new ConfigService()); // Change here if needed

@Global()
@Module({
  imports: [ConfigModule],
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}

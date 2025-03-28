import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';
import * as fs from 'fs';
import { Logger } from '@nestjs/common';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function getConfigDB(configService: ConfigService): Promise<TypeOrmModuleOptions> {
  while (!process.env.DB_HOST) {
    Logger.log('Waiting for DATABASE_HOST to be defined...', process.env.NODE_ENV);
    await delay(1000);
  }

  const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_NAME'),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [path.join(__dirname, '../database/migration/*.ts')],
    synchronize: false,
    // logging: ["query", "error", "schema", "warn", "info", "log"],
    // logger: "advanced-console",
    verboseRetryLog: true,
    // ssl: {
    //   ca: fs.readFileSync(path.join(process.cwd(), 'certs/us-east-1-bundle.pem')),
    //   rejectUnauthorized: true,
    // },
  };
  return typeOrmConfig;
}

export default getConfigDB;

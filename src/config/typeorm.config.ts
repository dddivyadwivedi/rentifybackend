/* eslint-disable @typescript-eslint/no-var-requires */
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
require('dotenv').config();

const host = process.env.DB_HOST;
const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306;
const username = process.env.DB_USER;
const database = process.env.DB_NAME;
const sync: boolean = process.env.DB_SYNC && process.env.DB_SYNC === 'true';

const ORMConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host,
  port,
  username,
  database,
  entities: [__dirname + '/../../dist/entity/**/*.entity{.js,.ts}'],
  synchronize: sync,
  logging: true,
  logger: 'file',
  migrations: ['dist/migration/**/*.js'],
  migrationsTableName: 'migrations_typeorm',
  migrationsRun: true,
};

export = ORMConfig;

import { DataSource } from 'typeorm';

require('dotenv').config();

const host = process.env.DB_HOST;
const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306;
const username = process.env.DB_USER;
const database = process.env.DB_NAME;
const sync: boolean = process.env.DB_SYNC && process.env.DB_SYNC === 'true';

const AppDataSource = new DataSource({
  type: 'mysql',
  host: host,
  port: port,
  username: username,
  database: database,
  entities: [__dirname + '/../../dist/entity/**/*.entity{.js,.ts}'],
  synchronize: sync,
  logging: true,
  logger: 'file',
  migrations: ['dist/migration/**/*.js'],
  migrationsTableName: 'migrations_typeorm',
  migrationsRun: true,
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });

export default AppDataSource;

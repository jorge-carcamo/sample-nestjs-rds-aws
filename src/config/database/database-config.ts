import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host: process.env.VAR_DB_HOST,
  port: process.env.VAR_DB_PORT,
  username: process.env.VAR_DB_USERNAME,
  password: process.env.VAR_DB_PASSWORD,
  database: process.env.VAR_DB_DATABASE,
  autoLoadEntities: process.env.VAR_AUTOLOAD_ENTITIES,
  synchronize: process.env.VAR_SYNCHRONIZE,
}));

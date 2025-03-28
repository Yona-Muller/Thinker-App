// src/database/ormconfig/ormconfig-dev.ts
import { DataSource } from 'typeorm';
import * as path from 'path';
import * as fs from 'fs';

export default new DataSource({
  type: 'postgres',
  host: 'thinker.cp0swoc6k3dm.us-east-2.rds.amazonaws.com',
  port: 5432,
  username: 'postgres',
  password: '****',
  database: 'thinker',
  entities: ['src/database/entity/*.{js,ts}'],
  migrations: ['src/database/migration/*.{js,ts}'],
  synchronize: false,
  migrationsRun: false,
  // ssl: {
  //   ca: fs.readFileSync(path.join(process.cwd(), 'certs/us-east-1-bundle.pem')),
  //   rejectUnauthorized: true,
  // },
});

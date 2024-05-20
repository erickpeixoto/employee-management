import * as dotenv from 'dotenv';
import { execSync } from 'child_process';
import { resolve } from 'path';

export default async () => {
  dotenv.config({ path: resolve(__dirname, '../../../.env.test') });

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not defined');
  }

  const schemaPath = resolve(
    __dirname,
    '../../../packages/database/prisma/schema.prisma',
  );
  try {
    execSync(
      `npx prisma migrate dev --name init --schema=${schemaPath} --preview-feature`,
      { stdio: 'inherit' },
    );
  } catch (error) {
    console.error('Error running migrations:', error);
    throw error;
  }
};

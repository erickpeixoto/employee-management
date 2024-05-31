import { execSync } from 'child_process';
import { resolve } from 'path';

export default async () => {

  process.env.DATABASE_URL = 'file:./test.db';
  const schemaPath = resolve(__dirname, 'database/prisma/schema.prisma');

  try {
    execSync(`npx prisma migrate dev --name init --schema=${schemaPath}`, { stdio: 'inherit' });
  } catch (error) {
    console.error('Error running migrations:', error);
    throw error;
  }
};

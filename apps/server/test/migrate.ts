import { execSync } from 'child_process';

const runMigrations = () => {
  console.log('Running migrations...');
  execSync('npx prisma migrate dev --name init --schema=prisma/schema.prisma', { stdio: 'inherit' });
};

runMigrations();

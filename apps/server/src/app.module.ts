import { Module, Logger } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeeModule } from './employee/employee.module';
import { DepartmentModule } from './department/department.module';

const coveragePath = resolve(process.cwd(), 'coverage/lcov-report');
const playwrightCoveragePath = resolve(process.cwd(), '../../packages/testing/playwright-report');

@Module({
  imports: [
    EmployeeModule,
    ServeStaticModule.forRoot({
      rootPath: coveragePath,
      serveRoot: '/unit-coverage',
    }),
    ServeStaticModule.forRoot({
      rootPath: playwrightCoveragePath,
      serveRoot: '/client-e2e-coverage',
    }),
     DepartmentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {
    if (coveragePath) {
      Logger.log(`Serving static files from: ${coveragePath}`);
    } 
  }
}

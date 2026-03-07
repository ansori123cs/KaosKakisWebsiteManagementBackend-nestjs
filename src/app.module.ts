import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MaterialModule } from './modules/master/material/material.module';
import { DrizzleModule } from './database/database.module';

@Module({
  imports: [MaterialModule, DrizzleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

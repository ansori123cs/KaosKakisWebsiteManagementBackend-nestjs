import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MaterialModule } from './modules/master/material/material.module';
import { SizeModule } from './modules/master/size/size.module';
import { ColorModule } from './modules/master/color/color.module';
import { DrizzleModule } from './database/database.module';
import { MachineModule } from './modules/master/machine/machine.module';

@Module({
  imports: [
    MaterialModule,
    SizeModule,
    ColorModule,
    MachineModule,
    DrizzleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MaterialModule } from './modules/master/material/material.module';
import { SizeModule } from './modules/master/size/size.module';
import { ColorModule } from './modules/master/color/color.module';
import { DrizzleModule } from './database/database.module';
import { MachineModule } from './modules/master/machine/machine.module';
import { SockModule } from './modules/transaction/sock/sock.module';
import { UploadModule } from './shared/upload/uppload.module';
import { PocketBaseModule } from './shared/pocketbase/pocketbase.module';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    //pocketbase module
    PocketBaseModule,
    //upload module
    UploadModule,
    //database module
    DrizzleModule,
    //master module
    MaterialModule,
    SizeModule,
    ColorModule,
    MachineModule,
    //transaction module
    SockModule,

    //config module
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
      errorMessage: 'Too many requests, please try again later.',
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

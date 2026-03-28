import { Module } from '@nestjs/common';
import { DrizzleModule } from 'src/database/database.module';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [DrizzleModule],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}

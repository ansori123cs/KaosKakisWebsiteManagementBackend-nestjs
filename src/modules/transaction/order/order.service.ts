import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DrizzleAsyncProvider } from 'src/database/drizzle.service';
import * as sc from 'src/database/drizzle/index';
import { OrderDto, OrderPaginatedDto } from './dto/query-order.dto';
import { and, count, eq, isNull, ne } from 'drizzle-orm';

@Injectable()
export class OrderService {
  private readonly logger = new Logger('Order');
  constructor(
    @Inject(DrizzleAsyncProvider) private db: NodePgDatabase<typeof sc>,
  ) {}
  async findAll(
    limit: number = 10,
    offset: number = 1,
  ): Promise<OrderPaginatedDto> {
    try {
      const [[total], row] = await Promise.all([
        await this.db
          .select({ count: count() })
          .from(sc.order)
          .where(ne(sc.order.status, 0)),

        await this.db.query.order.findMany({
          where: (order) =>
            and(eq(order.isDeleted, false), isNull(order.deletedAt)),
          columns: {
            id: true,
            status: true,
            createdAt: true,
            updatedAt: true,
          },
          with: {
            orderDetails: {
              with: {
                itemVariant: {
                  with: {
                    kaosKaki: {
                      columns: { name: true },
                    },
                  },
                },
              },
            },
            customer: {
              columns: {
                name: true,
              },
            },
          },
        }),
      ]);

      const result: OrderDto[] = row.map((item) => ({
        id: item.id,
        itemName: item.orderDetails[0].itemVariant?.kaosKaki?.name!,
        customerName: item.customer?.name!,
        startOrderDate: item.createdAt!,
        finishOrderDate: item.status == 2 ? item?.updatedAt! : '',
        status: item.status!,
      }));

      return {
        limit,
        offset,
        total: total.count,
        result,
      };
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}

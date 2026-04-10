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
import { and, count, eq, ilike, isNull, ne } from 'drizzle-orm';
import { CreateOrderDto, SelectOption } from './dto/create-order.dto';
import { DetailOrderDto } from './dto/update-order.dto';

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

  async findOne(id: string): Promise<DetailOrderDto> {
    try {
      const item = await this.db.query.order.findFirst({
        where: (order) =>
          and(
            eq(order.id, id),
            eq(order.isDeleted, false),
            isNull(order.deletedAt),
          ),
        columns: {
          id: true,
          note: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
        with: {
          orderDetails: {
            columns: {
              price: true,
              amount: true,
            },
            with: {
              itemVariant: {
                columns: {
                  size: true,
                  color: true,
                },
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
      });

      if (!item) {
        throw new InternalServerErrorException('Order not found');
      }

      const result: DetailOrderDto = {
        customerName: item.customer?.name!,
        note: item.note!,
        status: item.status!,
        createdAt: item.createdAt!,
        updatedAt: item.updatedAt!,
        orders: item.orderDetails.map((order) => ({
          itemName: order.itemVariant?.kaosKaki?.name!,
          color: order.itemVariant?.color!,
          size: order.itemVariant?.size!,
          quantity: order.amount!,
          price: order.price!,
        })),
      };

      return result;
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async searchCustomer(keyword: string): Promise<SelectOption[]> {
    try {
      const search = await this.db
        .select({
          value: sc.customer.id,
          label: sc.customer.name,
        })
        .from(sc.customer)
        .where(
          and(
            ilike(sc.customer.name, `%${keyword}%`),
            eq(sc.customer.isDeleted, false),
            isNull(sc.customer.deletedAt),
          ),
        )
        .limit(10);

      const result: SelectOption[] = search.map((item) => ({
        label: item.label!,
        value: item.value,
      }));

      return result;
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async create(createOrderDto: CreateOrderDto) {
    try {
      const result = await this.db.transaction(async (tx) => {
        const now = new Date().toISOString();

        const [newOrder] = await tx
          .insert(sc.order)
          .values({
            note: createOrderDto.note,
            customer: createOrderDto.customer,
            status: 1,
            createdAt: now,
            updatedAt: now,
            deletedAt: null,
            isDeleted: false,
            userDeleted: null,
          })
          .returning({
            id: sc.order.id,
            customerId: sc.order.customer,
          });

        const [newOrderDetails] = await tx
          .insert(sc.orderDetails)
          .values(
            createOrderDto.orderDetails.map((item) => ({
              order: newOrder.id,
              amount: item.ammount,
              price: item.price,
              status: 1,
              itemVariant: item.idItemVariant,
              createdAt: now,
              updatedAt: now,
              deletedAt: null,
              isDeleted: false,
              userDeleted: null,
            })),
          )
          .returning({ idItemVariant: sc.orderDetails.itemVariant });

        const [customerName, itemName] = await Promise.all([
          await tx
            .select({ name: sc.customer.name })
            .from(sc.customer)
            .where(eq(sc.customer.id, newOrder.customerId!)),
          await tx.query.itemVariant.findFirst({
            where: eq(sc.itemVariant.id, newOrderDetails.idItemVariant!),
            with: {
              kaosKaki: {
                columns: {
                  name: true,
                },
              },
            },
          }),
        ]);

        return {
          itemName: itemName?.kaosKaki?.name,
          customerName: customerName[0].name,
        };
      });
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}

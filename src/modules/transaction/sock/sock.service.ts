import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DrizzleAsyncProvider } from 'src/database/drizzle.service';
import * as sc from 'src/database/drizzle/index';
import { SockDto, SockPaginatedDto } from './dto/query-sock.dto';
import { and, eq, isNull, ne, count } from 'drizzle-orm';
import { CreateSockDto } from './dto/create-sock.dto';
import { ResponseSockDto, UpdateSockDto } from './dto/update-sock.dto';

@Injectable()
export class SockService {
  private readonly logger = new Logger('Sock');

  constructor(
    @Inject(DrizzleAsyncProvider) private db: NodePgDatabase<typeof sc>,
  ) {}

  async findAll(
    limit: number = 0,
    offset: number = 1,
  ): Promise<SockPaginatedDto> {
    try {
      const [[total], row] = await Promise.all([
        this.db
          .select({ count: count() })
          .from(sc.kaosKaki)
          .where(ne(sc.kaosKaki.status, 0)),

        this.db
          .select({
            id: sc.kaosKaki.id,
            name: sc.kaosKaki.name,
            status: sc.kaosKaki.status,
            created_at: sc.kaosKaki.createdAt,
          })
          .from(sc.kaosKaki)
          .where(ne(sc.kaosKaki.status, 0))
          .orderBy(sc.kaosKaki.name)
          .limit(limit)
          .offset((offset - 1) * limit),
      ]);

      const rowKaosKaki = await this.db.query.kaosKaki.findMany({
        where: (kaosKaki) =>
          and(eq(kaosKaki.isDeleted, false), isNull(kaosKaki.deletedAt)),
        columns: {
          id: true,
          name: true,
          code: true,
        },
        with: {
          itemMachines: {
            with: {
              machine: {
                columns: {
                  name: true,
                },
              },
            },
          },
        },
      });

      const result: SockDto[] = row.map((item) => ({
        id: item.id,
        name: item.name!,
        status: item.status!,
        created_at: item.created_at,
      }));

      return {
        total: total.count,
        limit,
        offset: offset,
        result,
      };
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  //create
  async create(createSockDto: CreateSockDto): Promise<ResponseSockDto> {
    try {
      const result = await this.db.transaction(async (tx) => {
        const now = new Date().toISOString();

        const [newKaos] = await tx
          .insert(sc.kaosKaki)
          .values({
            name: createSockDto.name,
            code: createSockDto.code,
            description: createSockDto.description,
            material: createSockDto.material,
            status: 1,
            isDeleted: false,
            createdAt: now,
            updatedAt: now,
            deletedAt: null,
            userDeleted: null,
          })
          .returning({
            id: sc.kaosKaki.id,
            code: sc.kaosKaki.code,
            name: sc.kaosKaki.name,
          });

        const [newItemMachines] = await tx
          .insert(sc.itemMachine)
          .values(
            createSockDto.machine.map((item) => ({
              item: newKaos.id,
              machine: item,
              status: 1,
              isDeleted: false,
              createdAt: now,
              updatedAt: now,
              deletedAt: null,
              userDeleted: null,
            })),
          )
          .returning();

        const [newVariations] = await tx
          .insert(sc.itemVariant)
          .values(
            createSockDto.variations.map((item) => ({
              item: newKaos.id,
              color: item.color,
              size: item.size,
              status: 1,
              isDeleted: false,
              createdAt: now,
              updatedAt: now,
              deletedAt: null,
              userDeleted: null,
            })),
          )
          .returning();

        return {
          code: newKaos.code!,
          name: newKaos.name!,
        };
      });

      return result;
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  //update
  async update(
    id: string,
    updateSockDto: UpdateSockDto,
  ): Promise<ResponseSockDto> {
    try {
      const result = await this.db.transaction(async (tx) => {
        const now = new Date().toISOString();
        //catch data user
        const user = 'test';

        const checkItem = await tx.query.kaosKaki.findFirst({
          where: eq(sc.kaosKaki.id, id),
          columns: {
            name: true,
            code: true,
            description: true,
            material: true,
            status: true,
          },
          with: {
            itemMachines: {
              columns: { machine: true },
            },
            itemVariants: {
              columns: { color: true, size: true },
            },
          },
        });

        const updatedData = {
          name:
            updateSockDto.name === checkItem?.name
              ? checkItem?.name
              : updateSockDto.name,
          code:
            updateSockDto.code === checkItem?.code
              ? checkItem?.code
              : updateSockDto.code,
          description:
            updateSockDto.description === checkItem?.description
              ? checkItem?.description
              : updateSockDto.description,
          material:
            updateSockDto.material === checkItem?.material
              ? checkItem?.material
              : updateSockDto.material,
          status:
            updateSockDto.status === checkItem?.status
              ? checkItem?.status
              : updateSockDto.status,
          updatedAt: now,
        };

        const [updateKaos] = await tx
          .update(sc.kaosKaki)
          .set(updatedData)
          .where(eq(sc.kaosKaki.id, id))
          .returning({
            id: sc.kaosKaki.id,
            code: sc.kaosKaki.code,
            name: sc.kaosKaki.name,
          });

        if (updateSockDto.machine) {
          //delete all machine data and add from payload only
          await tx
            .update(sc.itemMachine)
            .set({
              status: 0,
              isDeleted: true,
              updatedAt: now,
              deletedAt: now,
              userDeleted: user,
            })
            .where(eq(sc.itemMachine.item, updateKaos.id));

          //add all from payload
          const [newItemMachines] = await tx
            .insert(sc.itemMachine)
            .values(
              updateSockDto.machine.map((item) => ({
                item: updateKaos.id,
                machine: item,
                status: 1,
                isDeleted: false,
                createdAt: now,
                updatedAt: now,
                deletedAt: null,
                userDeleted: null,
              })),
            )
            .returning();
        }
        if (updateSockDto.variations) {
          //delete all variant data and add from payload only
          await tx
            .update(sc.itemVariant)
            .set({
              status: 0,
              isDeleted: true,
              updatedAt: now,
              deletedAt: now,
              userDeleted: user,
            })
            .where(eq(sc.itemVariant.item, updateKaos.id));

          const [newVariations] = await tx
            .insert(sc.itemVariant)
            .values(
              updateSockDto.variations.map((item) => ({
                item: updateKaos.id,
                color: item.color,
                size: item.size,
                status: 1,
                isDeleted: false,
                createdAt: now,
                updatedAt: now,
                deletedAt: null,
                userDeleted: null,
              })),
            )
            .returning();
        }

        return {
          code: updateKaos.code!,
          name: updateKaos.name!,
        };
      });

      return result;
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  //remove
  async remove(id: string): Promise<ResponseSockDto> {
    try {
      const result = await this.db.transaction(async (tx) => {
        return {
          code: '',
          name: '',
        };
      });
      return result;
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}

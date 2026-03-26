import {
  BadRequestException,
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
import {
  DetailSockDto,
  ResponseSockDto,
  UpdateSockDto,
} from './dto/update-sock.dto';
import { UploadService } from 'src/shared/upload/upload.service';

@Injectable()
export class SockService {
  private readonly logger = new Logger('Sock');

  constructor(
    @Inject(DrizzleAsyncProvider) private db: NodePgDatabase<typeof sc>,
    private readonly upload: UploadService,
  ) {}

  async findAll(
    limit: number = 10,
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
            columns: { machine: true },
          },
          itemVariants: {
            columns: { color: true, size: true },
          },
        },
      });

      const result: SockDto[] = row.map((item) => ({
        id: item.id,
        name: item.name! + JSON.stringify(rowKaosKaki),
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

  async findOne(id: string): Promise<DetailSockDto> {
    const [Item, selectMachines, selectMaterial, selectColors, selectSizes] =
      await Promise.all([
        await this.db.query.kaosKaki.findFirst({
          where: (kaosKaki) =>
            and(
              eq(kaosKaki.id, id),
              eq(kaosKaki.isDeleted, false),
              isNull(kaosKaki.deletedAt),
            ),
          columns: {
            id: true,
            name: true,
            code: true,
            createdAt: true,
            description: true,
            material: true,
            updatedAt: true,
            status: true,
          },
          with: {
            itemMachines: {
              columns: { machine: true },
            },
            itemVariants: {
              columns: { color: true, size: true },
            },
            itemFiles: {
              columns: {
                url: true,
                key: true,
                thumbnail: true,
                isPrimary: true,
              },
            },
          },
        }),
        await this.db
          .select({ label: sc.machine.name, value: sc.machine.id })
          .from(sc.machine)
          .where(
            and(ne(sc.machine.isDeleted, true), isNull(sc.machine.deletedAt)),
          )
          .orderBy(sc.machine.name),
        await this.db
          .select({ label: sc.material.name, value: sc.material.id })
          .from(sc.material)
          .where(
            and(ne(sc.material.isDeleted, true), isNull(sc.material.deletedAt)),
          )
          .orderBy(sc.material.name),
        await this.db
          .select({ label: sc.color.name, value: sc.color.id })
          .from(sc.color)
          .where(and(ne(sc.color.isDeleted, true), isNull(sc.color.deletedAt)))
          .orderBy(sc.color.name),
        await this.db
          .select({ label: sc.size.name, value: sc.size.id })
          .from(sc.size)
          .where(and(ne(sc.size.isDeleted, true), isNull(sc.size.deletedAt)))
          .orderBy(sc.size.name),
      ]);

    const selectOption = (items: { label: string | null; value: string }[]) => {
      return items.map((item) => ({
        label: item.label!,
        value: item.value!,
      }));
    };

    const result: DetailSockDto = {
      //sock detail
      code: Item?.code!,
      description: Item?.description!,
      id: Item?.id,
      machine: Item?.itemMachines.map((item) => item.machine!),
      images:
        Item?.itemFiles.map((file) => ({
          imageId: file?.key!,
          thumbnail: file?.thumbnail!,
          url: file?.url!,
          isPrimary: file?.isPrimary ?? false,
        })) ?? [],
      material: Item?.material!,
      name: Item?.name!,
      variations:
        Item?.itemVariants.map((item) => ({
          color: item?.color!,
          size: item?.size!,
        })) ?? [],
      status: Item?.status!,

      //selectOptions
      selectMachines: selectOption(selectMachines),
      selectMaterial: selectOption(selectMaterial),
      selectColors: selectOption(selectColors),
      selectSizes: selectOption(selectSizes),
    };

    return result;
  }

  //create
  async create(
    createSockDto: CreateSockDto,
    files?: Express.Multer.File[],
    token?: string,
  ): Promise<ResponseSockDto> {
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

        if (!files?.length) {
          throw new BadRequestException('Tidak ada file yang diupload');
        }
        const uploadedFiles = await this.upload.uploadMultiple(files!, token!);

        const [newPhotos] = await tx
          .insert(sc.itemFile)
          .values(
            uploadedFiles.map((item) => ({
              url: item.url,
              key: item.id,
              thumbnail: item.thumbUrl,
              item: newKaos.id,
              isPrimary: true, //di pertama saja sisanya false
            })),
          )
          .returning();

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
    files?: Express.Multer.File[],
    token?: string,
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
            itemFiles: {
              columns: { key: true, thumbnail: true, url: true },
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

        if (files) {
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

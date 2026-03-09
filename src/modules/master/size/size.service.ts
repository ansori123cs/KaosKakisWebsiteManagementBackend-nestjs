import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DrizzleAsyncProvider } from 'src/database/drizzle.service';
import * as sc from '../../../database/drizzle/schema';
import { CreateSizeDto } from './dto/create-size.dto';
import { eq, count, ne } from 'drizzle-orm';
import { ResponseSizeDto, UpdateSizeDto } from './dto/update-size.dto';
import {
  MasterDataDetailDto,
  MasterDataDto,
  MasterDataPaginatedDto,
} from './dto/query-size.dto';

@Injectable()
export class SizeService {
  private readonly logger = new Logger('Size');
  constructor(
    @Inject(DrizzleAsyncProvider)
    private db: NodePgDatabase<typeof sc>,
  ) {}

  //create
  async create(
    createSizeDto: CreateSizeDto,
  ): Promise<ResponseSizeDto> {
    try {
      const [newSize] = await this.db
        .insert(sc.size)
        .values({
          code: createSizeDto.code!,
          name: createSizeDto.name,
          description: createSizeDto.description,
          status: 1,
          isDeleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deletedAt: null,
          userDeleted: null,
        })
        .returning({ name: sc.size.name, code: sc.size.code });

      const result: ResponseSizeDto = {
        code: newSize.code!,
        name: newSize.name!,
      };
      return result;
    } catch (e) {
      if (e instanceof NotFoundException) {
        this.logger.error(e);
        throw new NotFoundException();
      }
      this.logger.error(e);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  //get all
  async findAll(
    limit: number = 10,
    offset: number = 1,
  ): Promise<MasterDataPaginatedDto> {
    try {
      const [[total], row] = await Promise.all([
        this.db
          .select({ count: count() })
          .from(sc.size)
          .where(ne(sc.size.status, 0)),

        this.db
          .select({
            name: sc.size.name,
            status: sc.size.status,
            code: sc.size.code,
          })
          .from(sc.size)
          .where(ne(sc.size.status, 0))
          .orderBy(sc.size.name)
          .limit(limit)
          .offset((offset - 1) * limit),
      ]);

      const result: MasterDataDto[] = row.map((item) => ({
        code: item.code!,
        name: item.name!,
        status: item.status!,
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

  //get one
  async findOne(id: string): Promise<MasterDataDetailDto> {
    const [data] = await this.db
      .select({
        name: sc.size.name,
        code: sc.size.code,
        description: sc.size.description,
        status: sc.size.status,
        created_at: sc.size.createdAt,
        updated_at: sc.size.updatedAt,
      })
      .from(sc.size)
      .where(eq(sc.size.id, id));

    if (!data) {
      throw new NotFoundException('Data not found');
    }

    const result: MasterDataDetailDto = {
      name: data.name!,
      code: data.code!,
      description: data.description!,
      status: data.status!,
      created_at: data.created_at!,
      updated_at: data.updated_at!,
    };

    return result;
  }

  //update
  async update(
    id: string,
    updateSizeDto: UpdateSizeDto,
  ): Promise<ResponseSizeDto> {
    try {
      const isDeleted = updateSizeDto.status === 0;
      const now = new Date().toISOString();

      //ambil user nanti
      const user = '';

      const [updateSize] = await this.db
        .update(sc.size)
        .set({
          code: updateSizeDto.code!,
          name: updateSizeDto.name,
          description: updateSizeDto.description,
          status: updateSizeDto.status,
          isDeleted: isDeleted,
          updatedAt: now,
          deletedAt: isDeleted ? now : null,
          userDeleted: isDeleted ? user : null,
        })
        .where(eq(sc.size.id, id))
        .returning({ name: sc.size.name, code: sc.size.code });

      if (!updateSize) {
        this.logger.error('Data Not Found');
        throw new NotFoundException('Data Not Found');
      }

      const result: ResponseSizeDto = {
        code: updateSize.code!,
        name: updateSize.name!,
      };
      return result;
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  //remove
  async remove(id: string): Promise<ResponseSizeDto> {
    try {
      const now = new Date().toISOString();
      const user = '';
      const [deletedSize] = await this.db
        .update(sc.size)
        .set({
          status: 0,
          updatedAt: now,
          isDeleted: true,
          deletedAt: now,
          userDeleted: user,
        })
        .where(eq(sc.size.id, id))
        .returning({ name: sc.size.name, code: sc.size.code });
      if (!deletedSize) {
        this.logger.error('Data Not Found');
        throw new NotFoundException('Data Not Found');
      }

      const result: ResponseSizeDto = {
        code: deletedSize.code!,
        name: deletedSize.name!,
      };
      return result;
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}

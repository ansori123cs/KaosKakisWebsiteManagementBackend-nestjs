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
import { CreateColorDto } from './dto/create-color.dto';
import { eq, count, ne } from 'drizzle-orm';
import { ResponseColorDto, UpdateColorDto } from './dto/update-color.dto';
import {
  MasterDataDetailDto,
  MasterDataDto,
  MasterDataPaginatedDto,
} from './dto/query-color.dto';

@Injectable()
export class ColorService {
  private readonly logger = new Logger('Color');
  constructor(
    @Inject(DrizzleAsyncProvider)
    private db: NodePgDatabase<typeof sc>,
  ) {}

  //create
  async create(createColorDto: CreateColorDto): Promise<ResponseColorDto> {
    try {
      const [newColor] = await this.db
        .insert(sc.color)
        .values({
          code: createColorDto.code!,
          name: createColorDto.name,
          description: createColorDto.description,
          status: 1,
          isDeleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deletedAt: null,
          userDeleted: null,
        })
        .returning({ name: sc.color.name, code: sc.color.code });

      const result: ResponseColorDto = {
        code: newColor.code!,
        name: newColor.name!,
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
          .from(sc.color)
          .where(ne(sc.color.status, 0)),

        this.db
          .select({
            name: sc.color.name,
            status: sc.color.status,
            code: sc.color.code,
          })
          .from(sc.color)
          .where(ne(sc.color.status, 0))
          .orderBy(sc.color.name)
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
        name: sc.color.name,
        code: sc.color.code,
        description: sc.color.description,
        status: sc.color.status,
        created_at: sc.color.createdAt,
        updated_at: sc.color.updatedAt,
      })
      .from(sc.color)
      .where(eq(sc.color.id, id));

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
    updateColorDto: UpdateColorDto,
  ): Promise<ResponseColorDto> {
    try {
      const isDeleted = updateColorDto.status === 0;
      const now = new Date().toISOString();

      //ambil user nanti
      const user = '';

      const [updateColor] = await this.db
        .update(sc.color)
        .set({
          code: updateColorDto.code!,
          name: updateColorDto.name,
          description: updateColorDto.description,
          status: updateColorDto.status,
          isDeleted: isDeleted,
          updatedAt: now,
          deletedAt: isDeleted ? now : null,
          userDeleted: isDeleted ? user : null,
        })
        .where(eq(sc.color.id, id))
        .returning({ name: sc.color.name, code: sc.color.code });

      if (!updateColor) {
        this.logger.error('Data Not Found');
        throw new NotFoundException('Data Not Found');
      }

      const result: ResponseColorDto = {
        code: updateColor.code!,
        name: updateColor.name!,
      };
      return result;
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  //remove
  async remove(id: string): Promise<ResponseColorDto> {
    try {
      const now = new Date().toISOString();
      const user = '';
      const [deletedColor] = await this.db
        .update(sc.color)
        .set({
          status: 0,
          updatedAt: now,
          isDeleted: true,
          deletedAt: now,
          userDeleted: user,
        })
        .where(eq(sc.color.id, id))
        .returning({ name: sc.color.name, code: sc.color.code });
      if (!deletedColor) {
        this.logger.error('Data Not Found');
        throw new NotFoundException('Data Not Found');
      }

      const result: ResponseColorDto = {
        code: deletedColor.code!,
        name: deletedColor.name!,
      };
      return result;
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}

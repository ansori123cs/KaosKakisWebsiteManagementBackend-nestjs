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
import { CreateMaterialDto } from './dto/create-material.dto';
import { eq, count, ne } from 'drizzle-orm';
import {
  ResponseMaterialDto,
  UpdateMaterialDto,
} from './dto/update-material.dto';
import {
  MasterDataDetailDto,
  MasterDataDto,
  MasterDataPaginatedDto,
} from './dto/query-material.dto';

@Injectable()
export class MaterialService {
  private readonly logger = new Logger('Material');
  constructor(
    @Inject(DrizzleAsyncProvider)
    private db: NodePgDatabase<typeof sc>,
  ) {}

  //create
  async create(
    createMaterialDto: CreateMaterialDto,
  ): Promise<ResponseMaterialDto> {
    try {
      const [newMaterial] = await this.db
        .insert(sc.material)
        .values({
          code: createMaterialDto.code!,
          name: createMaterialDto.name,
          description: createMaterialDto.description,
          status: 1,
          isDeleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deletedAt: null,
          userDeleted: null,
        })
        .returning({ name: sc.material.name, code: sc.material.code });

      const result: ResponseMaterialDto = {
        code: newMaterial.code!,
        name: newMaterial.name!,
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
          .from(sc.material)
          .where(ne(sc.material.status, 0)),

        this.db
          .select({
            name: sc.material.name,
            status: sc.material.status,
            code: sc.material.code,
          })
          .from(sc.material)
          .where(ne(sc.material.status, 0))
          .orderBy(sc.material.name)
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
        name: sc.material.name,
        code: sc.material.code,
        description: sc.material.description,
        status: sc.material.status,
        created_at: sc.material.createdAt,
        updated_at: sc.material.updatedAt,
      })
      .from(sc.material)
      .where(eq(sc.material.id, id));

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
    updateMaterialDto: UpdateMaterialDto,
  ): Promise<ResponseMaterialDto> {
    try {
      const isDeleted = updateMaterialDto.status === 0;
      const now = new Date().toISOString();

      //ambil user nanti
      const user = '';

      const [updateMaterial] = await this.db
        .update(sc.material)
        .set({
          code: updateMaterialDto.code!,
          name: updateMaterialDto.name,
          description: updateMaterialDto.description,
          status: updateMaterialDto.status,
          isDeleted: isDeleted,
          updatedAt: now,
          deletedAt: isDeleted ? now : null,
          userDeleted: isDeleted ? user : null,
        })
        .where(eq(sc.material.id, id))
        .returning({ name: sc.material.name, code: sc.material.code });

      if (!updateMaterial) {
        this.logger.error('Data Not Found');
        throw new NotFoundException('Data Not Found');
      }

      const result: ResponseMaterialDto = {
        code: updateMaterial.code!,
        name: updateMaterial.name!,
      };
      return result;
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  //remove
  async remove(id: string): Promise<ResponseMaterialDto> {
    try {
      const now = new Date().toISOString();
      const user = '';
      const [deletedMaterial] = await this.db
        .update(sc.material)
        .set({
          status: 0,
          updatedAt: now,
          isDeleted: true,
          deletedAt: now,
          userDeleted: user,
        })
        .where(eq(sc.material.id, id))
        .returning({ name: sc.material.name, code: sc.material.code });
      if (!deletedMaterial) {
        this.logger.error('Data Not Found');
        throw new NotFoundException('Data Not Found');
      }

      const result: ResponseMaterialDto = {
        code: deletedMaterial.code!,
        name: deletedMaterial.name!,
      };
      return result;
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}

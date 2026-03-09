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
import { eq, count, ne } from 'drizzle-orm';
import { CreateMachineDto } from './dto/create-machine.dto';
import { ResponseMachineDto, UpdateMachineDto } from './dto/update-machine.dto';
import {
  MasterDataDetailDto,
  MasterDataDto,
  MasterDataPaginatedDto,
} from './dto/query-machine.dto';

@Injectable()
export class MachineService {
  private readonly logger = new Logger('Machine');
  constructor(
    @Inject(DrizzleAsyncProvider)
    private db: NodePgDatabase<typeof sc>,
  ) {}

  //create
  async create(
    createMachineDto: CreateMachineDto,
  ): Promise<ResponseMachineDto> {
    try {
      const [newMachine] = await this.db
        .insert(sc.machine)
        .values({
          code: createMachineDto.code!,
          name: createMachineDto.name,
          description: createMachineDto.description,
          status: 1,
          isDeleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deletedAt: null,
          userDeleted: null,
        })
        .returning({ name: sc.machine.name, code: sc.machine.code });

      const result: ResponseMachineDto = {
        code: newMachine.code!,
        name: newMachine.name!,
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
          .from(sc.machine)
          .where(ne(sc.machine.status, 0)),

        this.db
          .select({
            name: sc.machine.name,
            status: sc.machine.status,
            code: sc.machine.code,
          })
          .from(sc.machine)
          .where(ne(sc.machine.status, 0))
          .orderBy(sc.machine.name)
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
        name: sc.machine.name,
        code: sc.machine.code,
        description: sc.machine.description,
        status: sc.machine.status,
        created_at: sc.machine.createdAt,
        updated_at: sc.machine.updatedAt,
      })
      .from(sc.machine)
      .where(eq(sc.machine.id, id));

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
    updateMachineDto: UpdateMachineDto,
  ): Promise<ResponseMachineDto> {
    try {
      const isDeleted = updateMachineDto.status === 0;
      const now = new Date().toISOString();

      //ambil user nanti
      const user = '';

      const [updateMachine] = await this.db
        .update(sc.material)
        .set({
          code: updateMachineDto.code!,
          name: updateMachineDto.name,
          description: updateMachineDto.description,
          status: updateMachineDto.status,
          isDeleted: isDeleted,
          updatedAt: now,
          deletedAt: isDeleted ? now : null,
          userDeleted: isDeleted ? user : null,
        })
        .where(eq(sc.material.id, id))
        .returning({ name: sc.material.name, code: sc.material.code });

      if (!updateMachine) {
        this.logger.error('Data Not Found');
        throw new NotFoundException('Data Not Found');
      }

      const result: ResponseMachineDto = {
        code: updateMachine.code!,
        name: updateMachine.name!,
      };
      return result;
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  //remove
  async remove(id: string): Promise<ResponseMachineDto> {
    try {
      const now = new Date().toISOString();
      const user = '';
      const [deletedMachine] = await this.db
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
      if (!deletedMachine) {
        this.logger.error('Data Not Found');
        throw new NotFoundException('Data Not Found');
      }

      const result: ResponseMachineDto = {
        code: deletedMachine.code!,
        name: deletedMachine.name!,
      };
      return result;
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}

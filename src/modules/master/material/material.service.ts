import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DrizzleAsyncProvider } from 'src/database/drizzle.service';
import * as sc from '../../../database/drizzle/schema';
import { CreateMaterialDto } from './dto/create-material.dto';
import { eq } from 'drizzle-orm';
import { UpdateMaterialDto } from './dto/update-material.dto';

@Injectable()
export class MaterialService {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private db: NodePgDatabase<typeof sc>,
  ) {}

  //create
  async create(createMaterialDto: CreateMaterialDto) {
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
        .returning();
      return newMaterial;
    } catch (e) {
      console.log(e);
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  //get all
  async findAll() {
    return this.db.select().from(sc.material).orderBy(sc.material.name);
  }

  //get one
  async findOne(id: string) {
    return this.db.select().from(sc.material).where(eq(sc.material.id, id));
  }

  //update
  async update(id: string, updateMaterialDto: UpdateMaterialDto) {
    try {
      const isDeleted = updateMaterialDto.status === 0 ? true : false;
      const [updateMaterial] = await this.db
        .update(sc.material)
        .set({
          code: updateMaterialDto.code!,
          name: updateMaterialDto.name,
          description: updateMaterialDto.description,
          status: updateMaterialDto.status,
          isDeleted: isDeleted,
          updatedAt: new Date().toISOString(),
          deletedAt: isDeleted ? new Date().toISOString() : null,
          userDeleted: isDeleted ? new Date().toISOString() : null,
        })
        .where(eq(sc.material.id, id))
        .returning();
      return updateMaterial;
    } catch (e) {
      console.log(e);
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  //remove
  async remove(id: string) {
    const user = '';
    const [deletedMaterial] = await this.db
      .update(sc.material)
      .set({
        status: 0,
        isDeleted: true,
        deletedAt: new Date().toISOString(),
        userDeleted: user,
      })
      .where(eq(sc.material.id, id))
      .returning();

    return deletedMaterial;
  }
}

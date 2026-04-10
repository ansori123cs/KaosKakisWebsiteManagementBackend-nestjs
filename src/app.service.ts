import { Inject, Injectable } from '@nestjs/common';
import { DrizzleAsyncProvider } from './database/drizzle.service';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as sc from 'src/database/drizzle/index';
import { sql } from 'drizzle-orm';
import { seed } from 'drizzle-seed';
@Injectable()
export class AppService {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private db: NodePgDatabase<typeof sc>,
  ) {}
  async getHello() {
    try {
      const result = await this.db.execute(sql`SELECT 1`);
      return {
        status: 'success',
        message: 'conection success',
      };
    } catch (error) {
      return {
        status: 'failed',
        message: 'conection failed',
      };
    }
  }
  async seeder() {
    try {
      await seed(this.db, {
        material: sc.material,
        size: sc.size,
        machine: sc.machine,
        color: sc.color,
        customer: sc.customer,
      }).refine((f) => ({
        material: { count: 10 },
        size: { count: 10 },
        machine: { count: 10 },
        color: { count: 10 },
        customer: { count: 10 },
      }));
      return {
        status: 'success',
        message: 'seeder success',
      };
    } catch (error) {
      console.error('Seeder error:', error);
      return {
        status: 'failed',
        message: 'seeder failed',
      };
    }
  }
}

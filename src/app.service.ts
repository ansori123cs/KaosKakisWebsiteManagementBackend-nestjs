import { Inject, Injectable } from '@nestjs/common';
import { DrizzleAsyncProvider } from './database/drizzle.service';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as sc from './database/drizzle/schema';
import { sql } from 'drizzle-orm';

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
}

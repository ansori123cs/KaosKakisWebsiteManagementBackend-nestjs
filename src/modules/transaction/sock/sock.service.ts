import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DrizzleAsyncProvider } from 'src/database/drizzle.service';
import * as sc from 'src/database/drizzle/schema';
import { SockDto, SockPaginatedDto } from './dto/query-sock.dto';
import { ne, count } from 'drizzle-orm';

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
}

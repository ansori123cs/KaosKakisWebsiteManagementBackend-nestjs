import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { PocketBaseService } from 'src/shared/pocketbase/pocketbase.service';

@Injectable()
export class PocketBaseAuthGuard implements CanActivate {
  constructor(private pbService: PocketBaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Bearer token diperlukan (PocketBase token)',
      );
    }

    const token = authHeader.split(' ')[1];

    try {
      const pb = this.pbService.getAuthenticatedClient(token);
      await pb.collection('users').authRefresh();
      req.pbUser = pb.authStore.record;
      req.pbToken = token;
      return true;
    } catch (err) {
      throw new UnauthorizedException(
        'Token PocketBase tidak valid atau expired',
      );
    }
  }
}

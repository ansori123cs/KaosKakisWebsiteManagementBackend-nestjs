import { Injectable } from '@nestjs/common';
import PocketBase from 'pocketbase';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PocketBaseService {
  private pb: PocketBase;

  constructor(private configService: ConfigService) {
    const url =
      this.configService.get<string>('PB_URL') || 'http://localhost:8090';
    this.pb = new PocketBase(url);
  }

  getAuthenticatedClient(token: string): PocketBase {
    const client = new PocketBase(this.pb.baseUrl);
    client.authStore.save(token, null);
    return client;
  }

  getFileUrl(
    record: any,
    thumbSize?: string,
  ): { url: string; thumbUrl: string } {
    const filename = record.file;
    const baseUrl = this.pb.files.getUrl(record, filename);

    let thumbUrl = baseUrl;
    if (thumbSize) {
      thumbUrl = this.pb.files.getUrl(record, filename, { thumb: thumbSize });
    }

    return { url: baseUrl, thumbUrl };
  }
}

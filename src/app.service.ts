import { Injectable } from '@nestjs/common';

export type Bahan = {
  id: number;
  name: string;
  description: string;
};
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getBahan(): Bahan[] {
    const listBahan: Bahan[] = [
      {
        id: 1,
        name: 'pe 30 s',
        description: 'bahan lembut 2 pe-30-s',
      },
      {
        id: 2,
        name: 'nylon',
        description: 'bahan nilon lembut sport',
      },
      {
        id: 3,
        name: 'polyster',
        description: 'bahan sedikit kasar tapi murah berkualitas',
      },
    ];
    return listBahan;
  }
}

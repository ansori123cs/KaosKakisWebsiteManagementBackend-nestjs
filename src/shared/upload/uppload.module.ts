// // supabase.module.ts
// import { Module, Global } from '@nestjs/common';
// import { createClient, SupabaseClient } from '@supabase/supabase-js';
// import { ConfigService, ConfigModule } from '@nestjs/config';

// @Global()
// @Module({
//   imports: [ConfigModule],
//   providers: [
//     {
//       provide: SupabaseClient,
//       useFactory: (configService: ConfigService) =>
//         createClient(
//           configService.get<string>('SUPABASE_URL'),
//           configService.get<string>('SUPABASE_ANON_KEY'),
//         ),
//       inject: [ConfigService],
//     },
//   ],
//   exports: [SupabaseClient],
// })
// export class SupabaseModule {}

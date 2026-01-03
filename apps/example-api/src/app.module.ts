import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseAuthModule } from '@app/supabase-auth';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SupabaseAuthModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        supabaseUrl: configService.getOrThrow<string>('SUPABASE_URL'),
        serviceRoleKey: configService.getOrThrow<string>(
          'SUPABASE_SERVICE_ROLE_KEY',
        ),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

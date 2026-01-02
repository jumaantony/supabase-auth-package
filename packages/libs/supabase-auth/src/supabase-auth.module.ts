import { DynamicModule, Module } from "@nestjs/common";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { SupabaseAuthService } from "./supabase-auth.service";
import {
  SUPABASE_AUTH_OPTIONS,
  SupabaseAuthModuleOptions,
  SupabaseAuthModuleAsyncOptions,
} from "./interface";
import { SUPABASE_CLIENT } from "./interface";
import { SupabaseAuthRepository } from "./repositories/supabase-auth.repository";

@Module({
  providers: [SupabaseAuthService],
  exports: [SupabaseAuthService],
})
export class SupabaseAuthModule {
  /**
   * Configure the module using environment variables.
   * Reads from: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
   * 
   * This is a convenience method that uses forRootAsync internally.
   */
  static forRoot(): DynamicModule {
    return this.forRootAsync({
      useFactory: () => {
        const options: SupabaseAuthModuleOptions = {
          supabaseUrl: process.env.SUPABASE_URL || "",
          serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
        };

        if (!options.supabaseUrl || !options.serviceRoleKey) {
          throw new Error(
            "Missing required environment variables: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"
          );
        }

        return options;
      },
    });
  }

  /**
   * Configure the module asynchronously.
   * Allows for dependency injection and async operations.
   * 
   * @example
   * // Using environment variables (default)
   * SupabaseAuthModule.forRootAsync({
   *   useFactory: () => ({
   *     supabaseUrl: process.env.SUPABASE_URL || '',
   *     serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
   *   }),
   * })
   * 
   * @example
   * // Using ConfigService (if needed later)
   * SupabaseAuthModule.forRootAsync({
   *   imports: [ConfigModule],
   *   useFactory: (configService: ConfigService) => ({
   *      supabaseUrl: configService.getOrThrow<string>('SUPABASE_URL'),
   *      serviceRoleKey: configService.getOrThrow<string>('SUPABASE_SERVICE_ROLE_KEY'),
   *   }),
   *   inject: [ConfigService],
   * })
   */
  static forRootAsync(
    options: SupabaseAuthModuleAsyncOptions
  ): DynamicModule {
    return {
      module: SupabaseAuthModule,
      imports: options.imports || [],
      providers: [
        {
          provide: SUPABASE_AUTH_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        {
          provide: SUPABASE_CLIENT,
          useFactory: (options: SupabaseAuthModuleOptions): SupabaseClient => {
            return createClient(
              options.supabaseUrl,
              options.serviceRoleKey,
              {
                auth: {
                  autoRefreshToken: false,
                  persistSession: false,
                },
              }
            );
          },
          inject: [SUPABASE_AUTH_OPTIONS],
        },
        SupabaseAuthRepository,
        SupabaseAuthService,
      ],
      exports: [SupabaseAuthService, SupabaseAuthRepository, SUPABASE_CLIENT],
    };
  }
}

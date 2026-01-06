import { ModuleMetadata } from '@nestjs/common';
import { Session, User } from '@supabase/supabase-js';

export interface SupabaseAuthModuleOptions {
  supabaseUrl: string;
  serviceRoleKey: string;
}

export interface SupabaseAuthModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (
    ...args: any[]
  ) => Promise<SupabaseAuthModuleOptions> | SupabaseAuthModuleOptions;
  inject?: any[];
}

export const SUPABASE_AUTH_OPTIONS = Symbol(
  'SUPABASE_AUTH_OPTIONS',
);

export const SUPABASE_CLIENT = Symbol('SUPABASE_CLIENT');

export interface IAuthResponseData {
  user: User | null;
  session: Session | null;
  error?: {
    message: string;
    status?: number;
  };
}

export interface IEmailSignUpAdditionalData{
  emailRedirectTo?: string;
  data?: Record<string, any>;
}

export interface IChannelData {
  channel: 'sms' | 'whatsapp';
}

export interface IPhoneSignUpAdditionalData {
  channel: IChannelData['channel'];
  data?: Record<string, any>;
}

export interface IUpdateUserData {
  email?: string;
  phone?: string;
  password?: string;
  user_metadata?: Record<string, any>;
  data?: Record<string, any>;
}
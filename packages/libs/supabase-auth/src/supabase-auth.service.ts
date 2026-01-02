import { Injectable } from '@nestjs/common';
import { SupabaseAuthRepository } from './repositories/supabase-auth.repository';
import { IAuthAdditionalData, IAuthResponseData } from './interface';

@Injectable()
export class SupabaseAuthService {
  constructor(private readonly supabaseAuthRepository: SupabaseAuthRepository) {}

  /**
   * Sign in a user with email and password
   */
  public async emailSignIn(email: string, password: string): Promise<IAuthResponseData> {
    const response = await this.supabaseAuthRepository.emailSignIn(email, password);
    return response;
  }

  /**
   * Sign up a user with email and password
   */
  public async emailSignUp(email: string, password: string, additionalData?: IAuthAdditionalData): Promise<IAuthResponseData> {
    const response = await this.supabaseAuthRepository.emailSignUp(email, password, additionalData);
    return response;
  }
}

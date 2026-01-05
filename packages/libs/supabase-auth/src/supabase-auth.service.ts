import { Injectable } from '@nestjs/common';
import { SupabaseAuthRepository } from './repositories/supabase-auth.repository';
import { IAuthAdditionalData, IAuthResponseData, IPhoneSignUpAdditionalData } from './interface';

@Injectable()
export class SupabaseAuthService {
  constructor(private readonly supabaseAuthRepository: SupabaseAuthRepository) {}

  /**
   * Sign in a user with email and password
   * @param email - The email of the user
   * @param password - The password of the user
   * @returns The response data
   */
  public async emailSignIn(email: string, password: string): Promise<IAuthResponseData> {
    const response = await this.supabaseAuthRepository.emailSignIn(email, password);
    return response;
  }

  /**
   * Sign up a user with email and password
   * @param email - The email of the user
   * @param password - The password of the user
   * @param additionalData - Additional data for the user 
   * @returns The response data
   */
  public async emailSignUp(email: string, password: string, additionalData?: IAuthAdditionalData): Promise<IAuthResponseData> {
    const response = await this.supabaseAuthRepository.emailSignUp(email, password, additionalData);
    return response;
  }

  /**
   * Sign up a user with phone and password
   * @param phone - The phone of the user
   * @param password - The password of the user
   * @param additionalData - Additional data for the user
   * @returns The response data
   */
  public async phoneSignUp(phone: string, password: string, additionalData?: IPhoneSignUpAdditionalData): Promise<IAuthResponseData> {
    const response = await this.supabaseAuthRepository.phoneSignUp(phone, password, additionalData);
    return response;
  }

  /**
   * Sign in a user with phone and password
   * @param phone - The phone of the user
   * @param password - The password of the user
   * @returns The response data
   */
  public async phoneSignIn(phone: string, password: string): Promise<IAuthResponseData> {
    const response = await this.supabaseAuthRepository.phoneSignIn(phone, password);
    return response;
  }

  /**
   * Delete a user
   * @param userId - The ID of the user
   * @returns The response data
   */
  public async deleteUser(userId: string): Promise<void | object> {
    const response = await this.supabaseAuthRepository.deleteUser(userId);
    return response;
  }
}

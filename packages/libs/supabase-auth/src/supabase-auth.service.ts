import { Injectable } from '@nestjs/common';
import { SupabaseAuthRepository } from './repositories/supabase-auth.repository';
import { IEmailSignUpAdditionalData, IAuthResponseData, IPhoneSignUpAdditionalData, IUpdateUserData, IChannelData } from './interface';
import { User } from '@supabase/supabase-js';

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
  public async emailSignUp(email: string, password: string, additionalData?: IEmailSignUpAdditionalData): Promise<IAuthResponseData> {
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

  /**
   * Update a user
   * @param userId - The ID of the user
   * @param updateUserData - The data to update the user
   * @returns The response data
   */
  public async updateUser(userId: string, updateUserData: IUpdateUserData): Promise<User | { error: { message: string; status?: number } }> {
    const response = await this.supabaseAuthRepository.updateUser(userId, updateUserData);
    return response;
  }

  
  /**
   * Verify an email OTP
   * @param email - The email of the user
   * @param token - The OTP token
   * @returns The response data
   */
  public async verifyEmailOtp(email: string, token: string): Promise<IAuthResponseData> {
    const response = await this.supabaseAuthRepository.verifyEmailOtp(email, token);
    return response;
  }

  /**
   * Verify a phone OTP
   * @param phone - The phone of the user
   * @param token - The OTP token
   * @returns The response data
   */
  public async verifyPhoneOtp(phone: string, token: string): Promise<IAuthResponseData> {
    const response = await this.supabaseAuthRepository.verifyPhoneOtp(phone, token);
    return response;
  }

  /**
   * Request an email OTP
   * @param email - The email of the user
   * @returns The response data
   */
  public async requestEmailOtp(email: string): Promise<IAuthResponseData> {
    const response = await this.supabaseAuthRepository.requestEmailOtp(email);
    return response;
  }

  /**
   * Request a phone OTP
   * @param phone - The phone of the user
   * @param channel - The channel of the user
   * @returns The response data
   */
  public async requestPhoneOtp(phone: string, channel: IChannelData): Promise<IAuthResponseData> {
    const response = await this.supabaseAuthRepository.requestPhoneOtp(phone, channel);
    return response;
  }
}

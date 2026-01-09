import { Injectable } from '@nestjs/common';
import {
  IAuthResponseData,
  IUpdateUserData,
  SupabaseAuthService,
  UserData,
} from '@app/supabase-auth';

@Injectable()
export class AppService {
  constructor(private readonly supabaseAuthService: SupabaseAuthService) {}

  public async emailSignIn(
    email: string,
    password: string,
  ): Promise<
    IAuthResponseData | { error: { message: string; status?: number } }
  > {
    const response = await this.supabaseAuthService.emailSignIn(
      email,
      password,
    );
    return response;
  }

  public async emailSignUp(
    email: string,
    password: string,
  ): Promise<
    IAuthResponseData | { error: { message: string; status?: number } }
  > {
    const response = await this.supabaseAuthService.emailSignUp(
      email,
      password,
      {
        data: {
          name: 'John Doe',
        },
      },
    );
    return response;
  }

  public async requestEmailOtp(
    email: string,
  ): Promise<
    IAuthResponseData | { error: { message: string; status?: number } }
  > {
    const response = await this.supabaseAuthService.requestEmailOtp(email);
    return response;
  }

  public async verifyEmailOtp(
    email: string,
    token: string,
  ): Promise<
    IAuthResponseData | { error: { message: string; status?: number } }
  > {
    const response = await this.supabaseAuthService.verifyEmailOtp(
      email,
      token,
    );
    return response;
  }

  public async phoneSignIn(
    phone: string,
    password: string,
  ): Promise<
    IAuthResponseData | { error: { message: string; status?: number } }
  > {
    const response = await this.supabaseAuthService.phoneSignIn(
      phone,
      password,
    );
    return response;
  }

  public async phoneSignUp(
    phone: string,
    password: string,
  ): Promise<
    IAuthResponseData | { error: { message: string; status?: number } }
  > {
    const response = await this.supabaseAuthService.phoneSignUp(
      phone,
      password,
    );
    return response;
  }

  public async requestPhoneOtp(
    phone: string,
  ): Promise<
    IAuthResponseData | { error: { message: string; status?: number } }
  > {
    const response = await this.supabaseAuthService.requestPhoneOtp(phone, {
      channel: 'whatsapp',
    });
    return response;
  }

  public async verifyPhoneOtp(
    phone: string,
    token: string,
  ): Promise<
    IAuthResponseData | { error: { message: string; status?: number } }
  > {
    const response = await this.supabaseAuthService.verifyPhoneOtp(
      phone,
      token,
    );
    return response;
  }

  public async deleteUser(
    userId: string,
  ): Promise<void | { error: { message: string; status?: number } }> {
    const response = await this.supabaseAuthService.deleteUser(userId);
    return response;
  }

  public async updateUser(
    userId: string,
    updateUserData: IUpdateUserData,
  ): Promise<
    UserData['user'] | { error: { message: string; status?: number } }
  > {
    const response = await this.supabaseAuthService.updateUser(
      userId,
      updateUserData,
    );
    return response;
  }
}

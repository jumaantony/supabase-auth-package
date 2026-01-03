import { Injectable } from '@nestjs/common';
import { IAuthResponseData, SupabaseAuthService } from '@app/supabase-auth';

@Injectable()
export class AppService {
  constructor(private readonly supabaseAuthService: SupabaseAuthService) {}

  public async emailSignIn(
    email: string,
    password: string,
  ): Promise<IAuthResponseData> {
    const response = await this.supabaseAuthService.emailSignIn(
      email,
      password,
    );
    return response;
  }

  public async emailSignUp(
    email: string,
    password: string,
  ): Promise<IAuthResponseData> {
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
}

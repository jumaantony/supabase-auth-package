import { Injectable, Inject } from "@nestjs/common";
import { SupabaseClient, User } from "@supabase/supabase-js";
import {
  IEmailSignUpAdditionalData,
  IAuthResponseData,
  IPhoneSignUpAdditionalData,
  SUPABASE_CLIENT,
  IChannelData,
  IUpdateUserData,
} from "../interface";

@Injectable()
export class SupabaseAuthRepository {
  constructor(
    @Inject(SUPABASE_CLIENT)
    private readonly supabase: SupabaseClient
  ) {}

  async emailSignUp(
    email: string,
    password: string,
    additionalData?: IEmailSignUpAdditionalData
  ): Promise<IAuthResponseData | { error: { message: string; status?: number } }> {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: additionalData?.data,
        emailRedirectTo: additionalData?.emailRedirectTo,
      },
    });

    if (error) {
      return {
        error: {
          message: error.message,
          status: error.status,
        },
      };
    }

    return {
      user: data.user,
      session: data.session,
    };
  }

  async emailSignIn(
    email: string,
    password: string
  ): Promise<IAuthResponseData | { error: { message: string; status?: number } }> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        error: {
          message: error.message,
          status: error.status,
        },
      };
    }

    if (!data.user) {
      return {
        user: null,
        session: null,
        error: {
          message: "Sign in failed",
        },
      };
    }

    return {
      user: data.user,
      session: data.session,
    };
  }

  async phoneSignIn(phone: string, password: string): Promise<IAuthResponseData | { error: { message: string; status?: number }}> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      phone,
      password,
    });

    if (error) {
      return {
        error: {
          message: error.message,
          status: error.status,
        },
      };
    }

    return {
      user: data.user,
      session: data.session,
    };
  }

  async phoneSignUp(phone: string, password: string, additionalData?: IPhoneSignUpAdditionalData): Promise<IAuthResponseData | { error: { message: string; status?: number }}> {
    const { data, error } = await this.supabase.auth.signUp({
      phone,
      password,
      options: {
        data: { ...additionalData?.data },
        channel: additionalData?.channel,
      },
    });

    if (error) {
      return {
        error: {
          message: error.message,
          status: error.status,
        },
      };
    }

    return {
      user: data.user,
      session: data.session,
    };
  }

  async verifyEmailOtp(email: string, token: string): Promise<IAuthResponseData | { error: { message: string; status?: number }}> {
    const { data, error } = await this.supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });

    if (error) {
      return {
        error: {
          message: error.message,
          status: error.status,
        },
      };
    }

    return {
      user: data.user,
      session: data.session,
    };
  }

  async verifyPhoneOtp(phone: string, token: string): Promise<IAuthResponseData | { error: { message: string; status?: number }}> {
    const { data, error } = await this.supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms',
    });

    if (error) {
      return {
        error: {
          message: error.message,
          status: error.status,
        },
      };
    }

    return {
      user: data.user,
      session: data.session,
    };
  }

  async requestEmailOtp(email: string): Promise<IAuthResponseData | { error: { message: string; status?: number }}> {
    const { data, error } = await this.supabase.auth.signInWithOtp({
      email,
    });

    if (error) {
      return {
        error: {
          message: error.message,
          status: error.status,
        },
      };
    }

    return {
      user: data.user,
      session: data.session,
    };
  }

  async requestPhoneOtp(phone: string, channel: IChannelData): Promise<IAuthResponseData | { error: { message: string; status?: number }}> {
    const { data, error } = await this.supabase.auth.signInWithOtp({
      phone,
      options: {
        channel: channel.channel,
      },
    });

    if (error) {
      return {  
        error: {
          message: error.message,
          status: error.status,
        },
      };
    }

    return {
      user: data.user,
      session: data.session,
    };
  }

  async updateUser(
    userId: string,
    updateUserData: IUpdateUserData
  ): Promise<User | { error: { message: string; status?: number } }> {
    const { data, error } = await this.supabase.auth.admin.updateUserById(
      userId,
      {
        ...updateUserData,
      }
    );

    if (error) {
      return {
        error: {
          message: error.message,
          status: error.status,
        },
      };
    }

    return data.user;
  }

  async deleteUser(userId: string): Promise<void | { error: { message: string; status?: number } }> {
    const { error } = await this.supabase.auth.admin.deleteUser(userId);
    if (error) {
      return {
        error: {
          message: error.message,
          status: error.status,
        },
      };
    }

    return;
  }
}

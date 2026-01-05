import { Injectable, Inject } from "@nestjs/common";
import { SupabaseClient } from "@supabase/supabase-js";
import {
  IEmailSignUpAdditionalData,
  IAuthResponseData,
  IPhoneSignUpAdditionalData,
  SUPABASE_CLIENT,
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
  ): Promise<IAuthResponseData> {
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
        user: null,
        session: null,
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
  ): Promise<IAuthResponseData> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        user: null,
        session: null,
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

  async phoneSignIn(phone: string, password: string): Promise<IAuthResponseData> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      phone,
      password,
    });

    if (error) {
      return {
        user: null,
        session: null,
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

  async phoneSignUp(phone: string, password: string, additionalData?: IPhoneSignUpAdditionalData): Promise<IAuthResponseData> {
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
        user: null,
        session: null,
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

  async deleteUser(userId: string): Promise<void | object> {
    const { error } = await this.supabase.auth.admin.deleteUser(userId);
    if (error) {
      return {
        error: {
          message: error.message,
          status: error.status,
        },
      };
    }
  }
}

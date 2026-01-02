# @app/supabase-auth

A NestJS module for Supabase authentication that provides a clean, type-safe interface for user authentication operations.

## Features

- 🔐 Email/password authentication (sign up, sign in)
- 🎯 Type-safe API with TypeScript
- 🔧 Flexible configuration (environment variables or ConfigService)
- 🛡️ Error handling with structured error responses
- 📦 Dependency injection ready
- 🚀 Easy to integrate with NestJS applications

## Installation

```bash
npm install @app/supabase-auth
# or
pnpm add @app/supabase-auth
# or
yarn add @app/supabase-auth
```

## Prerequisites

- NestJS 11.x
- A Supabase project with:
  - Project URL (`SUPABASE_URL`)
  - Service Role Key (`SUPABASE_SERVICE_ROLE_KEY`)

## Quick Start

### 1. Configure Environment Variables

Create a `.env` file in your project root:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 2. Import the Module

#### Using Environment Variables (Simple)

```typescript
import { Module } from '@nestjs/common';
import { SupabaseAuthModule } from '@app/supabase-auth';

@Module({
  imports: [SupabaseAuthModule.forRoot()],
})
export class AppModule {}
```

#### Using ConfigService (Recommended)

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SupabaseAuthModule } from '@app/supabase-auth';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SupabaseAuthModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        supabaseUrl: configService.getOrThrow<string>('SUPABASE_URL'),
        serviceRoleKey: configService.getOrThrow<string>('SUPABASE_SERVICE_ROLE_KEY'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

### 3. Use the Service

```typescript
import { Injectable } from '@nestjs/common';
import { SupabaseAuthService } from '@app/supabase-auth';

@Injectable()
export class AuthService {
  constructor(private readonly supabaseAuthService: SupabaseAuthService) {}

  async signIn(email: string, password: string) {
    const response = await this.supabaseAuthService.emailSignIn(email, password);
    
    if (response.error) {
      // Handle error
      throw new Error(response.error.message);
    }
    
    // Success - use response.user and response.session
    return {
      user: response.user,
      session: response.session,
    };
  }
}
```

## API Reference

### SupabaseAuthService

The main service for authentication operations.

#### `emailSignIn(email: string, password: string): Promise<IAuthResponseData>`

Sign in a user with email and password.

```typescript
const response = await supabaseAuthService.emailSignIn('user@example.com', 'password123');

if (response.error) {
  console.error('Sign in failed:', response.error.message);
} else {
  console.log('User:', response.user);
  console.log('Session:', response.session);
}
```

#### `emailSignUp(email: string, password: string, additionalData?: IAuthAdditionalData): Promise<IAuthResponseData>`

Sign up a new user with email and password.

```typescript
const response = await supabaseAuthService.emailSignUp(
  'user@example.com',
  'password123',
  {
    emailRedirectTo: 'https://yourapp.com/confirm',
    data: {
      full_name: 'John Doe',
      role: 'user',
    },
  }
);

if (response.error) {
  console.error('Sign up failed:', response.error.message);
} else {
  console.log('User created:', response.user);
}
```

### SupabaseAuthRepository

Lower-level repository for direct Supabase client access. Can be injected if you need more control.

```typescript
import { Injectable } from '@nestjs/common';
import { SupabaseAuthRepository } from '@app/supabase-auth';

@Injectable()
export class CustomAuthService {
  constructor(private readonly repository: SupabaseAuthRepository) {}
  
  // Use repository methods directly
}
```

### SUPABASE_CLIENT

The Supabase client instance can be injected directly if you need access to the full Supabase API.

```typescript
import { Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '@app/supabase-auth';

@Injectable()
export class CustomService {
  constructor(
    @Inject(SUPABASE_CLIENT)
    private readonly supabase: SupabaseClient
  ) {}
  
  // Use supabase client directly
}
```

## Types

### IAuthResponseData

The response type for authentication operations.

```typescript
interface IAuthResponseData {
  user: User | null;
  session: Session | null;
  error?: {
    message: string;
    status?: number;
  };
}
```

**Success Response:**
```typescript
{
  user: User,
  session: Session | null
}
```

**Error Response:**
```typescript
{
  user: null,
  session: null,
  error: {
    message: "Error message",
    status: 400 // optional
  }
}
```

### IAuthAdditionalData

Additional data for sign up operations.

```typescript
interface IAuthAdditionalData {
  emailRedirectTo?: string;  // URL to redirect after email confirmation
  data?: Record<string, any>; // Additional user metadata
}
```

## Error Handling

All authentication methods return a structured response that includes an optional `error` field. Always check for errors before using the response data:

```typescript
const response = await supabaseAuthService.emailSignIn(email, password);

if (response.error) {
  // Handle error
  return {
    success: false,
    message: response.error.message,
    status: response.error.status,
  };
}

// Success - proceed with user data
return {
  success: true,
  user: response.user,
  session: response.session,
};
```

## Example: Complete Controller Implementation

```typescript
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { SupabaseAuthService } from '@app/supabase-auth';
import { IAuthResponseData } from '@app/supabase-auth';

@Controller('auth')
export class AuthController {
  constructor(private readonly supabaseAuthService: SupabaseAuthService) {}

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(
    @Body() body: { email: string; password: string }
  ): Promise<IAuthResponseData> {
    return await this.supabaseAuthService.emailSignIn(
      body.email,
      body.password
    );
  }

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  async signUp(
    @Body() body: {
      email: string;
      password: string;
      fullName?: string;
    }
  ): Promise<IAuthResponseData> {
    return await this.supabaseAuthService.emailSignUp(
      body.email,
      body.password,
      {
        data: {
          full_name: body.fullName,
        },
      }
    );
  }
}
```

## Module Configuration Options

### SupabaseAuthModuleOptions

```typescript
interface SupabaseAuthModuleOptions {
  supabaseUrl: string;        // Your Supabase project URL
  serviceRoleKey: string;    // Your Supabase service role key
}
```

## Advanced Usage

### Custom Factory Function

You can use a custom factory function for more complex configuration:

```typescript
SupabaseAuthModule.forRootAsync({
  imports: [ConfigModule, SomeOtherModule],
  useFactory: (configService: ConfigService, otherService: OtherService) => ({
    supabaseUrl: configService.get('SUPABASE_URL'),
    serviceRoleKey: otherService.getSecretKey(),
  }),
  inject: [ConfigService, OtherService],
})
```

## License

This package is part of your monorepo and follows the same license as your project.


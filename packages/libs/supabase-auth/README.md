# @jumaantony/supabase-auth

A comprehensive NestJS module for Supabase authentication that provides a clean, type-safe interface for user authentication operations.

## Features

- 🔐 **Email/password authentication** (sign up, sign in)
- 📱 **Phone authentication** (sign up, sign in)
- 🔑 **OTP (One-Time Password) support** (email and SMS/WhatsApp)
- 👤 **User management** (update, delete users)
- 🎯 **Type-safe API** with TypeScript
- 🔧 **Flexible configuration** (environment variables or ConfigService)
- 🛡️ **Error handling** with structured error responses
- 📦 **Dependency injection ready**
- 🚀 **Easy to integrate** with NestJS applications
- ✅ **Fully tested** with comprehensive test coverage

## Installation

### From GitHub Packages

The package is published to GitHub Packages. To install it:

#### 1. Configure npm to use GitHub Packages

Create or update your `.npmrc` file:

```
@jumaantony:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

#### 2. Authenticate with GitHub

You'll need a GitHub Personal Access Token with `read:packages` permission:

```bash
export GITHUB_TOKEN=your_github_token_here
```

Or add it to your `.npmrc` directly (not recommended for production):

```
//npm.pkg.github.com/:_authToken=your_github_token_here
```

#### 3. Install the package

```bash
npm install @jumaantony/supabase-auth
# or
pnpm add @jumaantony/supabase-auth
# or
yarn add @jumaantony/supabase-auth
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
import { SupabaseAuthModule } from '@jumaantony/supabase-auth';

@Module({
  imports: [SupabaseAuthModule.forRoot()],
})
export class AppModule {}
```

#### Using ConfigService (Recommended)

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SupabaseAuthModule } from '@jumaantony/supabase-auth';

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
import { SupabaseAuthService } from '@jumaantony/supabase-auth';

@Injectable()
export class AuthService {
  constructor(private readonly supabaseAuthService: SupabaseAuthService) {}

  async signIn(email: string, password: string) {
    const response = await this.supabaseAuthService.emailSignIn(email, password);
        
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

#### Email Authentication

##### `emailSignIn(email: string, password: string): Promise<IAuthResponseData | { error: { message: string; status?: number } }>`

Sign in a user with email and password.

```typescript
const response = await supabaseAuthService.emailSignIn('user@example.com', 'password123');
```

#### Phone Authentication

##### `phoneSignIn(phone: string, password: string): Promise<IAuthResponseData | { error: { message: string; status?: number } }>`

Sign in a user with phone number and password.

```typescript
const response = await supabaseAuthService.phoneSignIn('+1234567890', 'password123');
```

##### `phoneSignUp(phone: string, password: string, additionalData?: IPhoneSignUpAdditionalData): Promise<IAuthResponseData | { error: { message: string; status?: number } }>`

Sign up a new user with phone number and password.

```typescript
const response = await supabaseAuthService.phoneSignUp(
  '+1234567890',
  'password123',
  {
    channel: 'sms', // or 'whatsapp'
    data: {
      full_name: 'John Doe',
    },
  }
);
```

#### OTP (One-Time Password) Authentication

##### `requestEmailOtp(email: string): Promise<IAuthResponseData | { error: { message: string; status?: number } }>`

Request an OTP to be sent to the user's email.

```typescript
const response = await supabaseAuthService.requestEmailOtp('user@example.com');
```

##### `requestPhoneOtp(phone: string, channel: IChannelData): Promise<IAuthResponseData | { error: { message: string; status?: number } }>`

Request an OTP to be sent via SMS or WhatsApp.

```typescript
const response = await supabaseAuthService.requestPhoneOtp('+1234567890', {
  channel: 'sms', // or 'whatsapp'
});
```

##### `verifyEmailOtp(email: string, token: string): Promise<IAuthResponseData | { error: { message: string; status?: number } }>`

Verify an email OTP token.

```typescript
const response = await supabaseAuthService.verifyEmailOtp('user@example.com', '123456');
```

##### `verifyPhoneOtp(phone: string, token: string): Promise<IAuthResponseData | { error: { message: string; status?: number } }>`

Verify a phone OTP token.

```typescript
const response = await supabaseAuthService.verifyPhoneOtp('+1234567890', '123456');
```

#### User Management

##### `updateUser(userId: string, updateUserData: IUpdateUserData): Promise<User | { error: { message: string; status?: number } }>`

Update a user's information.

```typescript
const result = await supabaseAuthService.updateUser('user-id', {
  email: 'newemail@example.com',
  phone: '+1234567890',
  password: 'newpassword',
  user_metadata: {
    full_name: 'Updated Name',
  },
});

if ('error' in result) {
  console.error('Update failed:', result.error.message);
} else {
  console.log('User updated:', result);
}
```

##### `deleteUser(userId: string): Promise<void | { error: { message: string; status?: number } }>`

Delete a user.

```typescript
const result = await supabaseAuthService.deleteUser('user-id');

if (result && 'error' in result) {
  console.error('Delete failed:', result.error.message);
} else {
  console.log('User deleted successfully');
}
```

### SupabaseAuthRepository

Lower-level repository for direct Supabase client access. Can be injected if you need more control.

```typescript
import { Injectable } from '@nestjs/common';
import { SupabaseAuthRepository } from '@jumaantony/supabase-auth';

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
import { SUPABASE_CLIENT } from '@jumaantony/supabase-auth';

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

### IEmailSignUpAdditionalData

Additional data for email sign up operations.

```typescript
interface IEmailSignUpAdditionalData {
  emailRedirectTo?: string;  // URL to redirect after email confirmation
  data?: Record<string, any>; // Additional user metadata
}
```

### IPhoneSignUpAdditionalData

Additional data for phone sign up operations.

```typescript
interface IPhoneSignUpAdditionalData {
  channel: 'sms' | 'whatsapp';  // Channel for OTP delivery
  data?: Record<string, any>;   // Additional user metadata
}
```

### IChannelData

Channel configuration for phone OTP requests.

```typescript
interface IChannelData {
  channel: 'sms' | 'whatsapp';
}
```

### IUpdateUserData

Data for updating user information.

```typescript
interface IUpdateUserData {
  email?: string;
  phone?: string;
  password?: string;
  user_metadata?: Record<string, any>;
  data?: Record<string, any>;
}
```

## Error Handling

All authentication methods return a structured response that includes an optional `error` field. Always check for errors before using the response data:

```typescript
const response = await supabaseAuthService.emailSignIn(email, password);

if ('error' in response && response.error) {
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
import { Controller, Post, Body, HttpCode, HttpStatus, Get, Param, Delete, Put } from '@nestjs/common';
import { SupabaseAuthService } from '@jumaantony/supabase-auth';
import { IAuthResponseData } from '@jumaantony/supabase-auth';

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

  @Post('phone/sign-in')
  @HttpCode(HttpStatus.OK)
  async phoneSignIn(
    @Body() body: { phone: string; password: string }
  ): Promise<IAuthResponseData> {
    return await this.supabaseAuthService.phoneSignIn(
      body.phone,
      body.password
    );
  }

  @Post('otp/email/request')
  @HttpCode(HttpStatus.OK)
  async requestEmailOtp(
    @Body() body: { email: string }
  ): Promise<IAuthResponseData> {
    return await this.supabaseAuthService.requestEmailOtp(body.email);
  }

  @Post('otp/email/verify')
  @HttpCode(HttpStatus.OK)
  async verifyEmailOtp(
    @Body() body: { email: string; token: string }
  ): Promise<IAuthResponseData> {
    return await this.supabaseAuthService.verifyEmailOtp(
      body.email,
      body.token
    );
  }

  @Post('otp/phone/request')
  @HttpCode(HttpStatus.OK)
  async requestPhoneOtp(
    @Body() body: { phone: string; channel: 'sms' | 'whatsapp' }
  ): Promise<IAuthResponseData> {
    return await this.supabaseAuthService.requestPhoneOtp(body.phone, {
      channel: body.channel,
    });
  }

  @Post('otp/phone/verify')
  @HttpCode(HttpStatus.OK)
  async verifyPhoneOtp(
    @Body() body: { phone: string; token: string }
  ): Promise<IAuthResponseData> {
    return await this.supabaseAuthService.verifyPhoneOtp(
      body.phone,
      body.token
    );
  }

  @Put('users/:id')
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Param('id') userId: string,
    @Body() updateData: IUpdateUserData
  ) {
    return await this.supabaseAuthService.updateUser(userId, updateData);
  }

  @Delete('users/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') userId: string) {
    return await this.supabaseAuthService.deleteUser(userId);
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

## Testing

The package includes comprehensive test coverage. To run tests:

```bash
pnpm test
```

To run tests with coverage:

```bash
pnpm test:cov
```

## Versioning

This package follows [Semantic Versioning](https://semver.org/). The package is automatically published to GitHub Packages whenever changes are pushed to the `main` branch in the `packages/libs/supabase-auth` directory.

## License

This package is part of your monorepo and follows the same license as your project.

## Support

For issues, questions, or contributions, please visit the [GitHub repository](https://github.com/jumaantony/supabase-auth-package).
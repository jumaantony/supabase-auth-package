# Supabase Auth Package

A monorepo containing a NestJS module for Supabase authentication and example applications demonstrating its usage.

## 📦 What's Inside?

This Turborepo monorepo includes the following:

### Apps

- **`example-api`** - A NestJS API application demonstrating how to use the `@app/supabase-auth` package
- **`docs`** - A Next.js documentation site
- **`web`** - A Next.js web application

### Packages

- **`@app/supabase-auth`** - A NestJS module for Supabase authentication with email/password support
  - See [packages/libs/supabase-auth/README.md](./packages/libs/supabase-auth/README.md) for detailed documentation
- **`@repo/ui`** - Shared React component library
- **`@repo/eslint-config`** - Shared ESLint configurations
- **`@repo/typescript-config`** - Shared TypeScript configurations

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- pnpm >= 9.0.0
- A Supabase project with:
  - Project URL
  - Service Role Key

### Installation

```bash
# Install dependencies
pnpm install
```

### Environment Setup

Create a `.env` file in the `apps/example-api` directory:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PORT=3000
```

## 🛠️ Development

### Run all apps in development mode

```bash
pnpm dev
```

### Run a specific app

```bash
# Run the example API
pnpm dev --filter=example-api

# Run the docs site
pnpm dev --filter=docs

# Run the web app
pnpm dev --filter=web
```

### Build

Build all apps and packages:

```bash
pnpm build
```

Build a specific package:

```bash
# Build the supabase-auth library
pnpm build --filter=@app/supabase-auth

# Build the example API
pnpm build --filter=example-api
```

### Lint

Lint all packages:

```bash
pnpm lint
```

Lint a specific package:

```bash
pnpm lint --filter=@app/supabase-auth
```

### Type Checking

Check types across all packages:

```bash
pnpm check-types
```

## 📚 Using the Supabase Auth Package

### Installation in Your Project

```bash
pnpm add @app/supabase-auth
```

### Quick Example

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

```typescript
import { Injectable } from '@nestjs/common';
import { SupabaseAuthService } from '@app/supabase-auth';

@Injectable()
export class AuthService {
  constructor(private readonly supabaseAuthService: SupabaseAuthService) {}

  async signIn(email: string, password: string) {
    const response = await this.supabaseAuthService.emailSignIn(email, password);
    
    if (response.error) {
      throw new Error(response.error.message);
    }
    
    return {
      user: response.user,
      session: response.session,
    };
  }
}
```

For complete documentation, see [packages/libs/supabase-auth/README.md](./packages/libs/supabase-auth/README.md).

## 🏗️ Project Structure

```
.
├── apps/
│   ├── example-api/          # NestJS API example
│   ├── docs/                  # Next.js docs site
│   └── web/                   # Next.js web app
├── packages/
│   ├── libs/
│   │   └── supabase-auth/     # Main Supabase auth library
│   ├── ui/                    # Shared UI components
│   ├── eslint-config/         # ESLint configurations
│   └── typescript-config/     # TypeScript configurations
├── turbo.json                 # Turborepo configuration
└── pnpm-workspace.yaml        # pnpm workspace configuration
```

## 🧪 Testing

### Run tests for a specific app

```bash
# Run example-api tests
pnpm test --filter=example-api
```

## 📝 Code Quality

This project uses:

- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Turborepo** for monorepo management

### Format code

```bash
pnpm format
```

## 🔧 Configuration

### Turborepo

The project uses [Turborepo](https://turborepo.org) for monorepo management. Configuration is in `turbo.json`.

### Package Manager

This project uses [pnpm](https://pnpm.io) as the package manager. The workspace is configured in `pnpm-workspace.yaml`.

## 📦 Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching) to share cache artifacts across machines.

To enable Remote Caching:

```bash
# Authenticate with Vercel
pnpm exec turbo login

# Link your Turborepo to Remote Cache
pnpm exec turbo link
```

## 🤝 Contributing

1. Create a new branch for your feature
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## 📄 License

This project is private and proprietary.

## 🔗 Useful Links

- [Supabase Auth Package Documentation](./packages/libs/supabase-auth/README.md)
- [Turborepo Documentation](https://turborepo.org/docs)
- [NestJS Documentation](https://docs.nestjs.com)
- [Supabase Documentation](https://supabase.com/docs)

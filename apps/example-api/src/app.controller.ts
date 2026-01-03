import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { EmailAuthCredentialsDto } from './dto/email-auth-credentials.dto';
import { ApiBody, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { IAuthResponseData } from '@app/supabase-auth';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('email-sign-in')
  @ApiOperation({ summary: 'Email sign in' })
  @ApiBody({ type: EmailAuthCredentialsDto })
  @ApiResponse({ status: 200, description: 'Email sign in successful' })
  public async emailSignIn(
    @Body() body: EmailAuthCredentialsDto,
  ): Promise<IAuthResponseData> {
    const response = await this.appService.emailSignIn(
      body.email,
      body.password,
    );
    return response;
  }

  @Post('email-sign-up')
  @ApiOperation({ summary: 'Email sign up' })
  @ApiBody({ type: EmailAuthCredentialsDto })
  @ApiResponse({ status: 200, description: 'Email sign up successful' })
  public async emailSignUp(
    @Body() body: EmailAuthCredentialsDto,
  ): Promise<IAuthResponseData> {
    const response = await this.appService.emailSignUp(
      body.email,
      body.password,
    );
    return response;
  }
}

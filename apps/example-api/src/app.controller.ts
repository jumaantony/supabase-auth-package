import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AppService } from './app.service';
import {
  EmailAuthCredentialsDto,
  EmailDataDto,
  EmailOtpDataDto,
} from './dto/email-auth-credentials.dto';
import { ApiBody, ApiResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { IAuthResponseData, UserData } from '@app/supabase-auth';
import { UpdateUserDataDto } from './dto/update-user-data.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('email-sign-in')
  @ApiOperation({ summary: 'Email sign in' })
  @ApiBody({ type: EmailAuthCredentialsDto })
  @ApiResponse({ status: 200, description: 'Email sign in successful' })
  public async emailSignIn(
    @Body() body: EmailAuthCredentialsDto,
  ): Promise<IAuthResponseData | { error: { message: string; status?: number } }> {
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
  ): Promise<IAuthResponseData | { error: { message: string; status?: number } }> {
    const response = await this.appService.emailSignUp(
      body.email,
      body.password,
    );
    return response;
  }

  @Post('request-email-otp')
  @ApiOperation({ summary: 'Request email OTP' })
  @ApiBody({ type: EmailDataDto })
  @ApiResponse({ status: 200, description: 'Email OTP requested successfully' })
  public async requestEmailOtp(
    @Body() body: EmailDataDto,
  ): Promise<IAuthResponseData | { error: { message: string; status?: number } }> {
    const response = await this.appService.requestEmailOtp(body.email);
    return response;
  }

  @Post('verify-email-otp')
  @ApiOperation({ summary: 'Verify email OTP' })
  @ApiBody({ type: EmailOtpDataDto })
  @ApiResponse({ status: 200, description: 'Email OTP verified successfully' })
  public async verifyEmailOtp(
    @Body() body: EmailOtpDataDto,
  ): Promise<IAuthResponseData | { error: { message: string; status?: number } }> {
    const response = await this.appService.verifyEmailOtp(
      body.email,
      body.token,
    );
    return response;
  }

  @Patch(':userId/update-user')
  @ApiOperation({ summary: 'Update user' })
  @ApiParam({
    name: 'userId',
    description: 'The ID of the user',
    example: '123',
  })
  @ApiBody({ type: UpdateUserDataDto })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  public async updateUser(
    @Param('userId') userId: string,
    @Body() body: UpdateUserDataDto,
  ): Promise<
    UserData['user'] | { error: { message: string; status?: number } }
  > {
    const response = await this.appService.updateUser(userId, body);
    return response;
  }
}

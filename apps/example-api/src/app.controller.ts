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
import {
  PhoneAuthCredentialsDto,
  PhoneDataDto,
  PhoneOtpDataDto,
} from './dto/phone-auth-credentials.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('email-sign-in')
  @ApiOperation({ summary: 'Email sign in' })
  @ApiBody({ type: EmailAuthCredentialsDto })
  @ApiResponse({ status: 200, description: 'Email sign in successful' })
  public async emailSignIn(
    @Body() body: EmailAuthCredentialsDto,
  ): Promise<
    IAuthResponseData | { error: { message: string; status?: number } }
  > {
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
  ): Promise<
    IAuthResponseData | { error: { message: string; status?: number } }
  > {
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
  ): Promise<
    IAuthResponseData | { error: { message: string; status?: number } }
  > {
    const response = await this.appService.requestEmailOtp(body.email);
    return response;
  }

  @Post('verify-email-otp')
  @ApiOperation({ summary: 'Verify email OTP' })
  @ApiBody({ type: EmailOtpDataDto })
  @ApiResponse({ status: 200, description: 'Email OTP verified successfully' })
  public async verifyEmailOtp(
    @Body() body: EmailOtpDataDto,
  ): Promise<
    IAuthResponseData | { error: { message: string; status?: number } }
  > {
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

  @Delete(':userId/delete-user')
  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({
    name: 'userId',
    description: 'The ID of the user',
    example: '123',
  })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  public async deleteUser(
    @Param('userId') userId: string,
  ): Promise<void | { error: { message: string; status?: number } }> {
    const response = await this.appService.deleteUser(userId);
    return response;
  }

  @Post('phone-sign-in')
  @ApiOperation({ summary: 'Phone sign in' })
  @ApiBody({ type: PhoneAuthCredentialsDto })
  @ApiResponse({ status: 200, description: 'Phone sign in successful' })
  public async phoneSignIn(
    @Body() body: PhoneAuthCredentialsDto,
  ): Promise<
    IAuthResponseData | { error: { message: string; status?: number } }
  > {
    const response = await this.appService.phoneSignIn(
      body.phone,
      body.password,
    );
    return response;
  }

  @Post('phone-sign-up')
  @ApiOperation({ summary: 'Phone sign up' })
  @ApiBody({ type: PhoneAuthCredentialsDto })
  @ApiResponse({ status: 200, description: 'Phone sign up successful' })
  public async phoneSignUp(
    @Body() body: PhoneAuthCredentialsDto,
  ): Promise<
    IAuthResponseData | { error: { message: string; status?: number } }
  > {
    const response = await this.appService.phoneSignUp(
      body.phone,
      body.password,
    );
    return response;
  }

  @Post('request-phone-otp')
  @ApiOperation({ summary: 'Request phone OTP' })
  @ApiBody({ type: PhoneDataDto })
  @ApiResponse({ status: 200, description: 'Phone OTP requested successfully' })
  public async requestPhoneOtp(
    @Body() body: PhoneDataDto,
  ): Promise<
    IAuthResponseData | { error: { message: string; status?: number } }
  > {
    const response = await this.appService.requestPhoneOtp(body.phone);
    return response;
  }

  @Post('verify-phone-otp')
  @ApiOperation({ summary: 'Verify phone OTP' })
  @ApiBody({ type: PhoneOtpDataDto })
  @ApiResponse({ status: 200, description: 'Phone OTP verified successfully' })
  public async verifyPhoneOtp(
    @Body() body: PhoneOtpDataDto,
  ): Promise<
    IAuthResponseData | { error: { message: string; status?: number } }
  > {
    const response = await this.appService.verifyPhoneOtp(
      body.phone,
      body.token,
    );
    return response;
  }
}

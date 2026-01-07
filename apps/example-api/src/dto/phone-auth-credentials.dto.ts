import { ApiProperty } from '@nestjs/swagger';

export class PhoneDataDto {
  @ApiProperty({
    description: 'The phone of the user',
    example: '+1234567890',
  })
  phone: string;
}

export class PhoneAuthCredentials extends PhoneDataDto {
  @ApiProperty({
    description: 'The password of the User',
    example: 'password',
  })
  password: string;
}

export class PhoneOtpDataDto extends PhoneDataDto {
  @ApiProperty({
    description: 'The OTP token',
    example: '123456',
  })
  token: string;
}

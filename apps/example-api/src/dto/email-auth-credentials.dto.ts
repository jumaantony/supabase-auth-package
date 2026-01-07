import { ApiProperty } from '@nestjs/swagger';

export class EmailDataDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'test@example.com',
  })
  email: string;
}

export class EmailAuthCredentialsDto extends EmailDataDto {
  @ApiProperty({
    description: 'The password of the user',
    example: 'password',
  })
  password: string;
}

export class EmailOtpDataDto extends EmailDataDto {
  @ApiProperty({
    description: 'The OTP token',
    example: '123456',
  })
  token: string;
}

import { ApiProperty } from '@nestjs/swagger';

export class EmailAuthCredentialsDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'test@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password',
  })
  password: string;
}

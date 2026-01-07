import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDataDto {
  @ApiProperty({
    description: 'The new email of the user',
    example: 'new@example.com',
  })
  email?: string;

  @ApiProperty({
    description: 'The new phone of the user',
    example: '+1234567890',
  })
  phone?: string;

  @ApiProperty({
    description: 'The new password of the user',
    example: 'newpassword',
  })
  password?: string;

  @ApiProperty({
    description: 'The new additional user metadata of the user',
    example: {
      custom_field: 'new_value',
    },
  })
  user_metadata?: {
    [key: string]: any;
  };

  @ApiProperty({
    description: 'The new additional data of the user',
    example: {
      custom_field: 'new_value',
    },
  })
  data?: {
    [key: string]: any;
  };
}

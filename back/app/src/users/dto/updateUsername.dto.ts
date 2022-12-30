import { PartialType, ApiProperty } from '@nestjs/swagger';
import { IsString, isAlpha, Matches } from 'class-validator';

export class UpdateUserNameDto{
	@ApiProperty()
	@Matches(/^[a-zA-Z0-9_-]{2,10}$/, {
		message: 'Username must contain only letters, numbers, underscores, and hyphens, and be between 2 and 10 characters in length'
	  })
	  username: string;
}
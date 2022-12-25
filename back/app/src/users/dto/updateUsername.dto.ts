import { PartialType, ApiProperty } from '@nestjs/swagger';
import { UserDto } from './User.dto';
import { IsString, isAlpha, Matches } from 'class-validator';

export class UpdateUserNameDto extends PartialType(UserDto){
	@ApiProperty()
	@IsString()
	@Matches(/[a-zA-Z0-9_-]{4,10}/, {message: 'Username must be alphanumeric'})
	username: string;
}
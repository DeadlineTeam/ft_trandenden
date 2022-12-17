import { PartialType, ApiProperty } from '@nestjs/swagger';
import { UserDto } from './User.dto';
// import { IsBoolean } from 'class-validator';

export class UpdateUserNameDto extends PartialType(UserDto){
	@ApiProperty()
	username: string;
}
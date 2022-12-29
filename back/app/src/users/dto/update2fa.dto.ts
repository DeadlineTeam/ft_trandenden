import { PartialType, ApiProperty } from '@nestjs/swagger';
import { UserDto } from './User.dto';
import { IsString, IsNotEmpty } from 'class-validator';

export class Update2faDto extends PartialType(UserDto){
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	twofasecret: string;
}
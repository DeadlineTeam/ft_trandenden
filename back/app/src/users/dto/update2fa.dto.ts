import { PartialType, ApiProperty } from '@nestjs/swagger';
import { UserDto } from './User.dto';
// import { IsBoolean } from 'class-validator';

export class Update2faDto extends PartialType(UserDto){
	@ApiProperty()
	value: boolean;
}
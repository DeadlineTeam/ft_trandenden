import { ApiProperty} from "@nestjs/swagger";
import {IsBoolean, IsNumber, IsNotEmpty, IsString, MaxLength, MinLength} from "class-validator";

export class UserDto {
	@ApiProperty()
	@IsNumber()
	@IsNotEmpty()
	id: number;
	
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	login?: string

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	username?: string

	@ApiProperty({required: false})
	@IsString()
	@IsNotEmpty()
	avatar_url?: string;

	@ApiProperty({default: false})
	@IsBoolean()
	twofactor: boolean;
}
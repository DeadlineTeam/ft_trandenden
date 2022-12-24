import { ApiProperty} from "@nestjs/swagger";
import {IsBoolean, IsNumber, IsNotEmpty, IsString, IsPositive,Max } from "class-validator";

export class UserDto {
	@ApiProperty()
	@IsNumber()
	@IsNotEmpty()
	id: number;

	@ApiProperty({required: true})
	@IsNumber()
	@IsNotEmpty()
	fortytwoid: number;

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

	@ApiProperty({default: false, required: false})
	@IsBoolean()
	twofactor?: boolean;

	
	@ApiProperty({required: false})
	@IsPositive()
	win?: number;

	@ApiProperty({required: false})
	@IsPositive()
	@IsNotEmpty()
	loss?: number;

	@ApiProperty({required: false})
	@IsPositive()
	@IsNotEmpty()
	winrate?: number;

	@ApiProperty({required: false})
	@IsPositive()
	@IsNotEmpty()
	@Max(3)
	rank?: number;
	
}
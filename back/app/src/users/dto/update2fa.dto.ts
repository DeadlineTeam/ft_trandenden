import { PartialType, ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class Update2faDto{
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	twofasecret: string;
}
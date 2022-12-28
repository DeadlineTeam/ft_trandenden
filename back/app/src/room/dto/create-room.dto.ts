import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';
export class CreateRoomDto {
	@IsString()
	name: string;
	@IsString()
  	visibility: string;
	@IsString()
	password?: string;
	@IsOptional()
	users?: number [];
}

import {IsArray, IsString, ValidateIf,IsNotEmpty, IsOptional, ValidationOptions } from 'class-validator';
export class CreateRoomDto {
	// @IsString()
	// @IsNotEmpty()
	name: string;

	// @IsString()
	// @IsNotEmpty()
  	visibility: string;
	
	
	@IsString()

	// @ValidateIf((object: any) => object.visibility !== undefined && object.visibility === 'Protected')
	// @IsNotEmpty({
	// 	message: 'Password is required for protected rooms',
	// 	when: (object: any) => object.password !== undefined
	//   } as ValidationOptions)
	password: string;

	// @IsArray()
	users: number [];
}

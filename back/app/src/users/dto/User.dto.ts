import { ApiProperty} from "@nestjs/swagger";

export class UserDto {
	@ApiProperty()
	id: number;
	
	@ApiProperty()
	login: string

	@ApiProperty()
	username: string

	@ApiProperty({required: false})
	avatar_url?: string;

	@ApiProperty({default: false})
	twofactor: boolean;
}
import { UpdateUserUseCase } from 'pet-core/user/application';
export class UpdateUserDto
    implements Omit<UpdateUserUseCase.Input, 'id'>
{	
	name: string;
    email: string;
    password?: string;	
	is_active?: boolean;
}

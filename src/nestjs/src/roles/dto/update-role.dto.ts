import { UpdateRoleUseCase } from 'pet-core/access/application';
export class UpdateRoleDto
    implements Omit<UpdateRoleUseCase.Input, 'id'>
{	
	name: string;
    description: string;
	is_active?: boolean;
}

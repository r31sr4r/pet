import { UpdateGroupUseCase } from 'pet-core/access/application';
export class UpdateGroupDto
    implements Omit<UpdateGroupUseCase.Input, 'id'>
{	
	name: string;
    description: string;
	is_active?: boolean;
}

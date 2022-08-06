import { UpdatePetUseCase } from 'pet-core/pet/application';
export class UpdatePetDto
    implements Omit<UpdatePetUseCase.Input, 'id'>
{	
	name: string;
	type: string;
	breed?: string;
	gender?: string;
	birth_date?: Date;
	is_active?: boolean;
}

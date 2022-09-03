import { CreateRoleUseCase } from 'pet-core/access/application';

export class CreateRoleDto implements CreateRoleUseCase.Input {
    name: string;
    description: string;
    is_active?: boolean;    
}

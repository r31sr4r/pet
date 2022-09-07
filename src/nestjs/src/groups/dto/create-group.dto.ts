import { CreateGroupUseCase } from 'pet-core/access/application';

export class CreateGroupDto implements CreateGroupUseCase.Input {
    name: string;
    description: string;
    is_active?: boolean;    
}

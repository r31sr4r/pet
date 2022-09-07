import { CreateUserAssignedToGroupAndRoleUseCase } from 'pet-core/access/application';

export class CreateUsersGroupsRoleDto implements CreateUserAssignedToGroupAndRoleUseCase.Input {
    user_id: string;
    group_id: string;
    role_id: string;    
}




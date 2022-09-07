import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { USER_PROVIDERS } from './users.providers';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserSequelize } from 'pet-core/user/infra';
import { GroupSequelize, RoleSequelize, UserAssignedToGroupAndRoleSequelize } from 'pet-core/access/infra';
import { GROUP_PROVIDERS } from '../groups/groups.providers';
import { ROLE_PROVIDERS } from '../roles/roles.providers';
import { USERS_GROUPS_ROLES_PROVIDERS } from '../users-groups-roles/users-groups-roles.providers';

@Module({
    imports: [
        SequelizeModule.forFeature([
            UserSequelize.UserModel,            
            GroupSequelize.GroupModel,
            RoleSequelize.RoleModel,
            UserAssignedToGroupAndRoleSequelize.UserAssignedToGroupAndRoleModel,
        ]),
    ],    
    controllers: [UsersController],
    providers: [
        ...Object.values(USER_PROVIDERS.REPOSITORIES),
        ...Object.values(USER_PROVIDERS.USE_CASES),
        ...Object.values(GROUP_PROVIDERS.REPOSITORIES),
        ...Object.values(GROUP_PROVIDERS.USE_CASES),
        ...Object.values(ROLE_PROVIDERS.REPOSITORIES),
        ...Object.values(ROLE_PROVIDERS.USE_CASES),
        ...Object.values(USERS_GROUPS_ROLES_PROVIDERS.REPOSITORIES),
        ...Object.values(USERS_GROUPS_ROLES_PROVIDERS.USE_CASES),
        
    ],
})
export class UsersModule {}

import { Module } from '@nestjs/common';
import { UsersGroupsRolesController } from './users-groups-roles.controller';
import { USERS_GROUPS_ROLES_PROVIDERS } from './users-groups-roles.providers';
import { SequelizeModule } from '@nestjs/sequelize';
import { GroupSequelize, RoleSequelize, UserAssignedToGroupAndRoleSequelize } from 'pet-core/access/infra';
import { USER_PROVIDERS } from '../users/users.providers';
import { UserSequelize } from 'pet-core/user/infra';
import { GROUP_PROVIDERS } from '../groups/groups.providers';
import { ROLE_PROVIDERS } from '../roles/roles.providers';
import { CUSTOMER_PROVIDERS } from '../customers/customers.providers';
import { CustomerSequelize } from 'pet-core/customer/infra';

@Module({
    imports: [
        SequelizeModule.forFeature([
            UserAssignedToGroupAndRoleSequelize.UserAssignedToGroupAndRoleModel,
            UserSequelize.UserModel,    
            GroupSequelize.GroupModel,
            RoleSequelize.RoleModel,
            CustomerSequelize.CustomerModel
        ]),
    ],
    controllers: [UsersGroupsRolesController],
    providers: [
        ...Object.values(USER_PROVIDERS.REPOSITORIES),
        ...Object.values(USER_PROVIDERS.USE_CASES),
        ...Object.values(USERS_GROUPS_ROLES_PROVIDERS.REPOSITORIES),
        ...Object.values(USERS_GROUPS_ROLES_PROVIDERS.USE_CASES),
        ...Object.values(GROUP_PROVIDERS.REPOSITORIES),
        ...Object.values(GROUP_PROVIDERS.USE_CASES),
        ...Object.values(ROLE_PROVIDERS.REPOSITORIES),
        ...Object.values(ROLE_PROVIDERS.USE_CASES),
        ...Object.values(CUSTOMER_PROVIDERS.REPOSITORIES),
        ...Object.values(CUSTOMER_PROVIDERS.USE_CASES) 
    ],
})
export class UsersGroupsRolesModule {}

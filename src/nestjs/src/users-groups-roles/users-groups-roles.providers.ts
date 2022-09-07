import { UserAssignedToGroupAndRoleRepository } from 'pet-core/access/domain';

import {
    CreateUserAssignedToGroupAndRoleUseCase,
    DeleteUserAssignedToGroupAndRoleUseCase,
    GetUserAssignedToGroupAndRoleUseCase,
    ListUserAssignedToGroupRoleUseCase    
} from 'pet-core/access/application';
import {
    UserAssignedToGroupAndRoleInMemoryRepository,
    UserAssignedToGroupAndRoleSequelize,
} from 'pet-core/access/infra';
import { getModelToken } from '@nestjs/sequelize';

export namespace USERS_GROUPS_ROLES_PROVIDERS {
    export namespace REPOSITORIES {
        export const USERS_GROUPS_ROLES_IN_MEMORY_REPOSITORY = {
            provide: 'UserAssignedToGroupAndRoleInMemoryRepository',
            useClass: UserAssignedToGroupAndRoleInMemoryRepository,
        };

        export const USERS_GROUPS_ROLES_SEQUELIZE_REPOSITORY = {
            provide: 'UserAssignedToGroupAndRoleSequelizeRepository',
            useFactory: (
                groupModel: typeof UserAssignedToGroupAndRoleSequelize.UserAssignedToGroupAndRoleModel,
            ) => {
                return new UserAssignedToGroupAndRoleSequelize.UserAssignedToGroupAndRoleSequelizeRepository(
                    groupModel,
                );
            },
            inject: [
                getModelToken(UserAssignedToGroupAndRoleSequelize.UserAssignedToGroupAndRoleModel),
            ],
        };

        export const USERS_GROUPS_ROLES_REPOSITORY = {
            provide: 'UserAssignedToGroupAndRoleRepository',
            useExisting: 'UserAssignedToGroupAndRoleSequelizeRepository',
        };
    }

    export namespace USE_CASES {
        export const CREATE_USERS_GROUPS_ROLES = {
            provide: CreateUserAssignedToGroupAndRoleUseCase.UseCase,
            useFactory: (userGroupRoleRepo: UserAssignedToGroupAndRoleRepository.Repository) => {
                return new CreateUserAssignedToGroupAndRoleUseCase.UseCase(userGroupRoleRepo);
            },
            inject: [REPOSITORIES.USERS_GROUPS_ROLES_REPOSITORY.provide],
        };
        export const GET_USERS_GROUPS_ROLES = {
            provide: GetUserAssignedToGroupAndRoleUseCase.UseCase,
            useFactory: (userGroupRoleRepo: UserAssignedToGroupAndRoleRepository.Repository) => {
                return new GetUserAssignedToGroupAndRoleUseCase.UseCase(userGroupRoleRepo);
            },
            inject: [REPOSITORIES.USERS_GROUPS_ROLES_REPOSITORY.provide],
        };

        export const LIST_CATEGORIES = {
            provide: ListUserAssignedToGroupRoleUseCase.UseCase,
            useFactory: (userGroupRoleRepo: UserAssignedToGroupAndRoleRepository.Repository) => {
                return new ListUserAssignedToGroupRoleUseCase.UseCase(userGroupRoleRepo);
            },
            inject: [REPOSITORIES.USERS_GROUPS_ROLES_REPOSITORY.provide],
        };

        export const DELETE_USERS_GROUPS_ROLES = {
            provide: DeleteUserAssignedToGroupAndRoleUseCase.UseCase,
            useFactory: (userGroupRoleRepo: UserAssignedToGroupAndRoleRepository.Repository) => {
                return new DeleteUserAssignedToGroupAndRoleUseCase.UseCase(userGroupRoleRepo);
            },
            inject: [REPOSITORIES.USERS_GROUPS_ROLES_REPOSITORY.provide],
        };
    }
}

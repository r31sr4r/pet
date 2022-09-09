import { UserRepository } from 'pet-core/user/domain';
import {
    GroupRepository,
    RoleRepository,
    UserAssignedToGroupAndRoleRepository,
} from 'pet-core/access/domain';
import {
    CreateUserUseCase,
    DeleteUserUseCase,
    GetUserUseCase,
    ListUsersUseCase,
    UpdateUserUseCase,
} from 'pet-core/user/application';
import { UserInMemoryRepository, UserSequelize } from 'pet-core/user/infra';
import { getModelToken } from '@nestjs/sequelize';
import { GROUP_PROVIDERS } from '../groups/groups.providers';
import { ROLE_PROVIDERS } from '../roles/roles.providers';
import { USERS_GROUPS_ROLES_PROVIDERS } from '../users-groups-roles/users-groups-roles.providers';
import { CustomerRepository } from 'pet-core/customer/domain';
import { CUSTOMER_PROVIDERS } from '../customers/customers.providers';

export namespace USER_PROVIDERS {
    export namespace REPOSITORIES {
        export const USER_IN_MEMORY_REPOSITORY = {
            provide: 'UserInMemoryRepository',
            useClass: UserInMemoryRepository,
        };

        export const USER_SEQUELIZE_REPOSITORY = {
            provide: 'UserSequelizeRepository',
            useFactory: (userModel: typeof UserSequelize.UserModel) => {
                return new UserSequelize.UserSequelizeRepository(userModel);
            },
            inject: [getModelToken(UserSequelize.UserModel)],
        };

        export const USER_REPOSITORY = {
            provide: 'UserRepository',
            useExisting: 'UserSequelizeRepository',
        };
    }

    export namespace USE_CASES {
        export const CREATE_USER = {
            provide: CreateUserUseCase.UseCase,
            useFactory: (
                userRepo: UserRepository.Repository,
                groupRepo: GroupRepository.Repository,
                roleRepo: RoleRepository.Repository,
                usersGroupsRolesRepo: UserAssignedToGroupAndRoleRepository.Repository,
                customerRepo: CustomerRepository.Repository,
            ) => {
                return new CreateUserUseCase.UseCase(
                    userRepo,
                    groupRepo,
                    roleRepo,
                    usersGroupsRolesRepo,
                    customerRepo,
                );
            },
            inject: [
                REPOSITORIES.USER_REPOSITORY.provide,
                GROUP_PROVIDERS.REPOSITORIES.GROUP_REPOSITORY.provide,
                ROLE_PROVIDERS.REPOSITORIES.ROLE_REPOSITORY.provide,
                USERS_GROUPS_ROLES_PROVIDERS.REPOSITORIES
                    .USERS_GROUPS_ROLES_REPOSITORY.provide,                
                CUSTOMER_PROVIDERS.REPOSITORIES.CUSTOMER_REPOSITORY.provide,
            ],
        };

        export const UPDATE_USER = {
            provide: UpdateUserUseCase.UseCase,
            useFactory: (userRepo: UserRepository.Repository) => {
                return new UpdateUserUseCase.UseCase(userRepo);
            },
            inject: [REPOSITORIES.USER_REPOSITORY.provide],
        };

        export const GET_USER = {
            provide: GetUserUseCase.UseCase,
            useFactory: (userRepo: UserRepository.Repository) => {
                return new GetUserUseCase.UseCase(userRepo);
            },
            inject: [REPOSITORIES.USER_REPOSITORY.provide],
        };

        export const LIST_CATEGORIES = {
            provide: ListUsersUseCase.UseCase,
            useFactory: (userRepo: UserRepository.Repository) => {
                return new ListUsersUseCase.UseCase(userRepo);
            },
            inject: [REPOSITORIES.USER_REPOSITORY.provide],
        };

        export const DELETE_USER = {
            provide: DeleteUserUseCase.UseCase,
            useFactory: (userRepo: UserRepository.Repository) => {
                return new DeleteUserUseCase.UseCase(userRepo);
            },
            inject: [REPOSITORIES.USER_REPOSITORY.provide],
        };
    }
}

import { UserRepository } from 'pet-core/user/domain';
import { GroupRepository } from 'pet-core/access/domain';
import { RoleRepository } from 'pet-core/access/domain';

import {
    CreateUserUseCase,
    DeleteUserUseCase,
    GetUserUseCase,
    ListUsersUseCase,
    UpdateUserUseCase,
} from 'pet-core/user/application';
import { UserInMemoryRepository, UserSequelize } from 'pet-core/user/infra';
import { getModelToken } from '@nestjs/sequelize';

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
            ) => {
                return new CreateUserUseCase.UseCase(
                    userRepo,
                    groupRepo,
                    roleRepo,
                );
            },
            inject: [REPOSITORIES.USER_REPOSITORY.provide],
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

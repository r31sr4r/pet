import { UserRepository } from 'pet-core/user/domain';
import {
    CreateUserUseCase,
    DeleteUserUseCase,
    GetUserUseCase,
    ListUsersUseCase,
    UpdateUserUseCase,
} from 'pet-core/user/application';
import { UserInMemoryRepository, UserSequelize } from 'pet-core/user/infra';
import { getModelToken } from '@nestjs/sequelize'


export namespace PET_PROVIDERS {
    export namespace REPOSITORIES {
        export const PET_IN_MEMORY_REPOSITORY = {
            provide: 'UserInMemoryRepository',
            useClass: UserInMemoryRepository,
        };

        export const PET_SEQUELIZE_REPOSITORY = {
            provide: 'UserSequelizeRepository',
            useFactory: (categoryModel: typeof UserSequelize.UserModel) => {
                return new UserSequelize.UserSequelizeRepository(categoryModel);

            },
            inject: [getModelToken(UserSequelize.UserModel)],
        };

        export const PET_REPOSITORY = {
            provide: 'UserRepository',
            useExisting: 'UserSequelizeRepository',
        };
    }

    export namespace USE_CASES {
        export const CREATE_PET = {
            provide: CreateUserUseCase.UseCase,
            useFactory: (categoryRepo: UserRepository.Repository) => {
                return new CreateUserUseCase.UseCase(categoryRepo);
            },
            inject: [REPOSITORIES.PET_REPOSITORY.provide],
        };

        export const UPDATE_PET = {
            provide: UpdateUserUseCase.UseCase,
            useFactory: (categoryRepo: UserRepository.Repository) => {
                return new UpdateUserUseCase.UseCase(categoryRepo);
            },
            inject: [REPOSITORIES.PET_REPOSITORY.provide],
        };

        export const GET_PET = {
            provide: GetUserUseCase.UseCase,
            useFactory: (categoryRepo: UserRepository.Repository) => {
                return new GetUserUseCase.UseCase(categoryRepo);
            },
            inject: [REPOSITORIES.PET_REPOSITORY.provide],
        };

        export const LIST_CATEGORIES = {
            provide: ListUsersUseCase.UseCase,
            useFactory: (categoryRepo: UserRepository.Repository) => {
                return new ListUsersUseCase.UseCase(categoryRepo);
            },
            inject: [REPOSITORIES.PET_REPOSITORY.provide],
        };

        export const DELETE_PET = {
            provide: DeleteUserUseCase.UseCase,
            useFactory: (categoryRepo: UserRepository.Repository) => {
                return new DeleteUserUseCase.UseCase(categoryRepo);
            },
            inject: [REPOSITORIES.PET_REPOSITORY.provide],
        };
    }
}

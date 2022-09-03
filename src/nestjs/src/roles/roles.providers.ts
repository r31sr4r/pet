import { RoleRepository } from 'pet-core/access/domain';

import {
    CreateRoleUseCase,
    DeleteRoleUseCase,
    GetRoleUseCase,
    ListRolesUseCase,
    UpdateRoleUseCase,
} from 'pet-core/access/application';
import { RoleInMemoryRepository, RoleSequelize } from 'pet-core/access/infra';
import { getModelToken } from '@nestjs/sequelize';

export namespace ROLE_PROVIDERS {
    export namespace REPOSITORIES {
        export const ROLE_IN_MEMORY_REPOSITORY = {
            provide: 'RoleInMemoryRepository',
            useClass: RoleInMemoryRepository,
        };

        export const ROLE_SEQUELIZE_REPOSITORY = {
            provide: 'RoleSequelizeRepository',
            useFactory: (roleModel: typeof RoleSequelize.RoleModel) => {
                return new RoleSequelize.RoleSequelizeRepository(roleModel);
            },
            inject: [getModelToken(RoleSequelize.RoleModel)],
        };

        export const ROLE_REPOSITORY = {
            provide: 'RoleRepository',
            useExisting: 'RoleSequelizeRepository',
        };
    }

    export namespace USE_CASES {
        export const CREATE_ROLE = {
            provide: CreateRoleUseCase.UseCase,
            useFactory: (
                roleRepo: RoleRepository.Repository,
            ) => {
                return new CreateRoleUseCase.UseCase(
                    roleRepo,                    
                );
            },
            inject: [REPOSITORIES.ROLE_REPOSITORY.provide],
        };

        export const UPDATE_ROLE = {
            provide: UpdateRoleUseCase.UseCase,
            useFactory: (roleRepo: RoleRepository.Repository) => {
                return new UpdateRoleUseCase.UseCase(roleRepo);
            },
            inject: [REPOSITORIES.ROLE_REPOSITORY.provide],
        };

        export const GET_ROLE = {
            provide: GetRoleUseCase.UseCase,
            useFactory: (roleRepo: RoleRepository.Repository) => {
                return new GetRoleUseCase.UseCase(roleRepo);
            },
            inject: [REPOSITORIES.ROLE_REPOSITORY.provide],
        };

        export const LIST_CATEGORIES = {
            provide: ListRolesUseCase.UseCase,
            useFactory: (roleRepo: RoleRepository.Repository) => {
                return new ListRolesUseCase.UseCase(roleRepo);
            },
            inject: [REPOSITORIES.ROLE_REPOSITORY.provide],
        };

        export const DELETE_ROLE = {
            provide: DeleteRoleUseCase.UseCase,
            useFactory: (roleRepo: RoleRepository.Repository) => {
                return new DeleteRoleUseCase.UseCase(roleRepo);
            },
            inject: [REPOSITORIES.ROLE_REPOSITORY.provide],
        };
    }
}

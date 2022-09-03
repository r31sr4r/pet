import { GroupRepository } from 'pet-core/access/domain';

import {
    CreateGroupUseCase,
    DeleteGroupUseCase,
    GetGroupUseCase,
    ListGroupsUseCase,
    UpdateGroupUseCase,
} from 'pet-core/access/application';
import { GroupInMemoryRepository, GroupSequelize } from 'pet-core/access/infra';
import { getModelToken } from '@nestjs/sequelize';

export namespace GROUP_PROVIDERS {
    export namespace REPOSITORIES {
        export const GROUP_IN_MEMORY_REPOSITORY = {
            provide: 'GroupInMemoryRepository',
            useClass: GroupInMemoryRepository,
        };

        export const GROUP_SEQUELIZE_REPOSITORY = {
            provide: 'GroupSequelizeRepository',
            useFactory: (groupModel: typeof GroupSequelize.GroupModel) => {
                return new GroupSequelize.GroupSequelizeRepository(groupModel);
            },
            inject: [getModelToken(GroupSequelize.GroupModel)],
        };

        export const GROUP_REPOSITORY = {
            provide: 'GroupRepository',
            useExisting: 'GroupSequelizeRepository',
        };
    }

    export namespace USE_CASES {
        export const CREATE_GROUP = {
            provide: CreateGroupUseCase.UseCase,
            useFactory: (
                groupRepo: GroupRepository.Repository,
            ) => {
                return new CreateGroupUseCase.UseCase(
                    groupRepo,                    
                );
            },
            inject: [REPOSITORIES.GROUP_REPOSITORY.provide],
        };

        export const UPDATE_GROUP = {
            provide: UpdateGroupUseCase.UseCase,
            useFactory: (groupRepo: GroupRepository.Repository) => {
                return new UpdateGroupUseCase.UseCase(groupRepo);
            },
            inject: [REPOSITORIES.GROUP_REPOSITORY.provide],
        };

        export const GET_GROUP = {
            provide: GetGroupUseCase.UseCase,
            useFactory: (groupRepo: GroupRepository.Repository) => {
                return new GetGroupUseCase.UseCase(groupRepo);
            },
            inject: [REPOSITORIES.GROUP_REPOSITORY.provide],
        };

        export const LIST_CATEGORIES = {
            provide: ListGroupsUseCase.UseCase,
            useFactory: (groupRepo: GroupRepository.Repository) => {
                return new ListGroupsUseCase.UseCase(groupRepo);
            },
            inject: [REPOSITORIES.GROUP_REPOSITORY.provide],
        };

        export const DELETE_GROUP = {
            provide: DeleteGroupUseCase.UseCase,
            useFactory: (groupRepo: GroupRepository.Repository) => {
                return new DeleteGroupUseCase.UseCase(groupRepo);
            },
            inject: [REPOSITORIES.GROUP_REPOSITORY.provide],
        };
    }
}

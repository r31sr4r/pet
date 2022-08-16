import { PetRepository } from 'pet-core/pet/domain';
import {
    CreatePetUseCase,
    DeletePetUseCase,
    GetPetUseCase,
    ListPetsUseCase,
    UpdatePetUseCase,
} from 'pet-core/pet/application';
import { PetInMemoryRepository, PetSequelize } from 'pet-core/pet/infra';
import { getModelToken } from '@nestjs/sequelize'


export namespace PET_PROVIDERS {
    export namespace REPOSITORIES {
        export const PET_IN_MEMORY_REPOSITORY = {
            provide: 'PetInMemoryRepository',
            useClass: PetInMemoryRepository,
        };

        export const PET_SEQUELIZE_REPOSITORY = {
            provide: 'PetSequelizeRepository',
            useFactory: (categoryModel: typeof PetSequelize.PetModel) => {
                return new PetSequelize.PetSequelizeRepository(categoryModel);

            },
            inject: [getModelToken(PetSequelize.PetModel)],
        };

        export const PET_REPOSITORY = {
            provide: 'PetRepository',
            useExisting: 'PetSequelizeRepository',
        };
    }

    export namespace USE_CASES {
        export const CREATE_PET = {
            provide: CreatePetUseCase.UseCase,
            useFactory: (categoryRepo: PetRepository.Repository) => {
                return new CreatePetUseCase.UseCase(categoryRepo);
            },
            inject: [REPOSITORIES.PET_REPOSITORY.provide],
        };

        export const UPDATE_PET = {
            provide: UpdatePetUseCase.UseCase,
            useFactory: (categoryRepo: PetRepository.Repository) => {
                return new UpdatePetUseCase.UseCase(categoryRepo);
            },
            inject: [REPOSITORIES.PET_REPOSITORY.provide],
        };

        export const GET_PET = {
            provide: GetPetUseCase.UseCase,
            useFactory: (categoryRepo: PetRepository.Repository) => {
                return new GetPetUseCase.UseCase(categoryRepo);
            },
            inject: [REPOSITORIES.PET_REPOSITORY.provide],
        };

        export const LIST_CATEGORIES = {
            provide: ListPetsUseCase.UseCase,
            useFactory: (categoryRepo: PetRepository.Repository) => {
                return new ListPetsUseCase.UseCase(categoryRepo);
            },
            inject: [REPOSITORIES.PET_REPOSITORY.provide],
        };

        export const DELETE_PET = {
            provide: DeletePetUseCase.UseCase,
            useFactory: (categoryRepo: PetRepository.Repository) => {
                return new DeletePetUseCase.UseCase(categoryRepo);
            },
            inject: [REPOSITORIES.PET_REPOSITORY.provide],
        };
    }
}

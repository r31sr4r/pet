import { PetRepository } from 'pet-core/pet/domain';
import {
    CreatePetUseCase,
    DeletePetUseCase,
    GetPetUseCase,
    ListPetsUseCase,
    UpdatePetUseCase,
} from 'pet-core/pet/application';
import { PetInMemoryRepository } from 'pet-core/pet/infra';

export namespace PET_PROVIDERS {
    export namespace REPOSITORIES {
        export const PET_IN_MEMORY_REPOSITORY = {
            provide: 'PetInMemoryRepository',
            useClass: PetInMemoryRepository,
        };
    }

    export namespace USE_CASES {
        export const CREATE_PET = {
            provide: 'CreatePetUseCase',
            useFactory: (categoryRepo: PetRepository.Repository) => {
                return new CreatePetUseCase.UseCase(categoryRepo);
            },
            inject: [REPOSITORIES.PET_IN_MEMORY_REPOSITORY.provide],
        };

        export const UPDATE_PET = {
            provide: 'UpdatePetUseCase',
            useFactory: (categoryRepo: PetRepository.Repository) => {
                return new UpdatePetUseCase.UseCase(categoryRepo);
            },
            inject: [REPOSITORIES.PET_IN_MEMORY_REPOSITORY.provide],
        };

        export const GET_PET = {
            provide: GetPetUseCase.UseCase,
            useFactory: (categoryRepo: PetRepository.Repository) => {
                return new GetPetUseCase.UseCase(categoryRepo);
            },
            inject: [REPOSITORIES.PET_IN_MEMORY_REPOSITORY.provide],
        };

        export const LIST_CATEGORIES = {
            provide: 'ListPetsUseCase',
            useFactory: (categoryRepo: PetRepository.Repository) => {
                return new ListPetsUseCase.UseCase(categoryRepo);
            },
            inject: [REPOSITORIES.PET_IN_MEMORY_REPOSITORY.provide],
        };

        export const DELETE_PET = {
            provide: DeletePetUseCase.UseCase,
            useFactory: (categoryRepo: PetRepository.Repository) => {
                return new DeletePetUseCase.UseCase(categoryRepo);
            },
            inject: [REPOSITORIES.PET_IN_MEMORY_REPOSITORY.provide],
        };
    }
}

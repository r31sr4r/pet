import { Module } from '@nestjs/common';
import { PetsService } from './pets.service';
import { PetsController } from './pets.controller';
import {
    CreatePetUseCase,
    DeletePetUseCase,
    GetPetUseCase,
    ListPetsUseCase,
    UpdatePetUseCase,
} from 'pet-core/pet/application';
import { PetInMemoryRepository } from 'pet-core/pet/infra';
import PetRepository from 'pet-core/dist/pet/domain/repository/pet.repository';

@Module({
    controllers: [PetsController],
    providers: [
        PetsService,
        {
            provide: 'PetInMemoryRepository',
            useClass: PetInMemoryRepository,
        },
        {
            provide: CreatePetUseCase.UseCase,
            useFactory: (petRepo: PetRepository.Repository) => {
                return new CreatePetUseCase.UseCase(petRepo);
            },
            inject: ['PetInMemoryRepository'],
        },
        {
            provide: UpdatePetUseCase.UseCase,
            useFactory: (petRepo: PetRepository.Repository) => {
                return new UpdatePetUseCase.UseCase(petRepo);
            },
            inject: ['PetInMemoryRepository'],
        },
        {
            provide: GetPetUseCase.UseCase,
            useFactory: (petRepo: PetRepository.Repository) => {
                return new GetPetUseCase.UseCase(petRepo);
            },
            inject: ['PetInMemoryRepository'],
        },
        {
            provide: ListPetsUseCase.UseCase,
            useFactory: (petRepo: PetRepository.Repository) => {
                return new ListPetsUseCase.UseCase(petRepo);
            },
            inject: ['PetInMemoryRepository'],
        },
        {
            provide: DeletePetUseCase.UseCase,
            useFactory: (petRepo: PetRepository.Repository) => {
                return new DeletePetUseCase.UseCase(petRepo);
            },
            inject: ['PetInMemoryRepository'],
        },        
        
    ],
})
export class PetsModule {}

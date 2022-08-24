import { Test, TestingModule } from '@nestjs/testing';
import { PetsController } from '../../pets.controller';
import { PetsModule } from '../../pets.module';
import { ConfigModule } from '../../../config/config.module';
import { DatabaseModule } from '../../../database/database.module';
import {
    CreatePetUseCase,
    DeletePetUseCase,
    GetPetUseCase,
    ListPetsUseCase,
    UpdatePetUseCase,
} from 'pet-core/pet/application';
import { PetRepository } from 'pet-core/pet/domain';
import { PET_PROVIDERS } from '../../pets.providers';

describe('PetsController Integration Tests', () => {
    let controller: PetsController;
    let repository: PetRepository.Repository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot(), DatabaseModule, PetsModule],
        }).compile();

        controller = module.get(PetsController);
        repository = module.get(
            PET_PROVIDERS.REPOSITORIES.PET_REPOSITORY.provide,
        );
    });

    it('should be defined', async () => {
        expect(controller).toBeDefined();
        expect(controller['createUseCase']).toBeInstanceOf(
            CreatePetUseCase.UseCase,
        );
        expect(controller['updateUseCase']).toBeInstanceOf(
            UpdatePetUseCase.UseCase,
        );
        expect(controller['deleteUseCase']).toBeInstanceOf(
            DeletePetUseCase.UseCase,
        );
        expect(controller['listUseCase']).toBeInstanceOf(
            ListPetsUseCase.UseCase,
        );
        expect(controller['getUseCase']).toBeInstanceOf(GetPetUseCase.UseCase);
    });

    describe('should create a category', () => {
        const arrange = [
            {
                request: {
                    name: 'Toto',
                    type: 'dog',
                },
                expectedPresenter: {
                    name: 'Toto',
                    type: 'dog',
                    breed: null,
                    gender: null,
                    birth_date: null,
                    is_active: true,
                },
            },
            // {
            //     request: {
            //         name: 'Movie',
            //         description: 'Movie category',
            //     },
            //     expectedPresenter: {
            //         name: 'Movie',
            //         description: 'Movie category',
            //         is_active: true,
            //     },
            // },
            // {
            //     request: {
            //         name: 'Movie',
            //         description: 'Movie category',
            //         is_active: false,
            //     },
            //     expectedPresenter: {
            //         name: 'Movie',
            //         description: 'Movie category',
            //         is_active: false,
            //     },
            // },
        ];

        test.each(arrange)(
            'with request $request',
            async ({ request, expectedPresenter }) => {
                const presenter = await controller.create(request);
                const entity = await repository.findById(presenter.id);

                expect(entity).toMatchObject({
                    id: presenter.id,
                    name: expectedPresenter.name,                    
                    type: expectedPresenter.type,
                    breed: expectedPresenter.breed,
                    gender: expectedPresenter.gender,
                    birth_date: expectedPresenter.birth_date,
                    is_active: expectedPresenter.is_active,
                    created_at: presenter.created_at,
                });

                expect(presenter.id).toBe(entity.id);
                expect(presenter.name).toBe(expectedPresenter.name);
                expect(presenter.type).toBe(
                    expectedPresenter.type,
                );
                expect(presenter.breed).toBe(
                    expectedPresenter.breed,
                );
                expect(presenter.gender).toBe(
                    expectedPresenter.gender
                );
                expect(presenter.birth_date).toBe(
                    expectedPresenter.birth_date
                );
                expect(presenter.is_active).toBe(expectedPresenter.is_active);
                expect(presenter.created_at).toStrictEqual(entity.created_at);
            },
        );
    });
});

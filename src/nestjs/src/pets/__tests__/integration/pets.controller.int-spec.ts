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
import { CustomersController } from '../../../customers/customers.controller';
import { CustomersModule } from '../../../customers/customers.module';

describe('PetsController Integration Tests', () => {
    let controller: PetsController;
    let repository: PetRepository.Repository;
    let customerController: CustomersController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot(),
                DatabaseModule,
                PetsModule,
                CustomersModule,
            ],
        }).compile();

        controller = module.get(PetsController);
        customerController = module.get(CustomersController);
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

    it('should create a pet', async () => {
        const customerArrange = {
            name: 'John Doe',
            email: 'john@mail.com',
        };

        const customer = await customerController.create(customerArrange);

        const birth_date = new Date('2021-04-05');
        const arrange = [
            {
                request: {
                    name: 'Toto',
                    type: 'dog',
                    customer_id: customer.id,
                },
                expectedPresenter: {
                    name: 'Toto',
                    type: 'dog',
                    breed: null,
                    gender: null,
                    birth_date: null,
                    is_active: true,
                    customer_id: customer.id,
                },
            },
            {
                request: {
                    name: 'Titi',
                    type: 'cat',
                    customer_id: customer.id,
                },
                expectedPresenter: {
                    name: 'Titi',
                    type: 'cat',
                    breed: null,
                    gender: null,
                    birth_date: null,
                    is_active: true,
                    customer_id: customer.id,
                },
            },
            {
                request: {
                    name: 'Garfield',
                    type: 'cat',
                    breed: 'orange',
                    gender: 'Male',
                    birth_date,
                    is_active: false,
                    customer_id: customer.id
                },
                expectedPresenter: {
                    name: 'Garfield',
                    type: 'cat',
                    breed: 'orange',
                    gender: 'Male',
                    birth_date,
                    is_active: false,
                    customer_id: customer.id
                },
            },
        ];

        arrange.forEach(async ({ request, expectedPresenter }) => {
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
                customer_id: expectedPresenter.customer_id,
            });
            expect(presenter.id).toBe(entity.id);
            expect(presenter.name).toBe(expectedPresenter.name);
            expect(presenter.type).toBe(expectedPresenter.type);
            expect(presenter.breed).toBe(expectedPresenter.breed);
            expect(presenter.gender).toBe(expectedPresenter.gender);
            expect(presenter.birth_date).toBe(expectedPresenter.birth_date);
            expect(presenter.is_active).toBe(expectedPresenter.is_active);
            expect(presenter.created_at).toStrictEqual(entity.created_at);
            expect(presenter.customer_id).toBe(expectedPresenter.customer_id);
        });
    });
});

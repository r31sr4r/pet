import { Test, TestingModule } from '@nestjs/testing';
import { CustomersController } from '../../customers.controller';
import { CustomersModule } from '../../customers.module';
import { ConfigModule } from '../../../config/config.module';
import { DatabaseModule } from '../../../database/database.module';
import {
    CreateCustomerUseCase,
    DeleteCustomerUseCase,
    GetCustomerUseCase,
    ListCustomersUseCase,
    UpdateCustomerUseCase,
} from 'pet-core/customer/application';
import { CustomerRepository } from 'pet-core/customer/domain';
import { CUSTOMER_PROVIDERS } from '../../customers.providers';

describe('CustomersController Integration Tests', () => {
    let controller: CustomersController;
    let repository: CustomerRepository.Repository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot(), DatabaseModule, CustomersModule],
        }).compile();

        controller = module.get(CustomersController);
        repository = module.get(
            CUSTOMER_PROVIDERS.REPOSITORIES.CUSTOMER_REPOSITORY.provide,
        );
    });

    it('should be defined', async () => {
        expect(controller).toBeDefined();
        expect(controller['createUseCase']).toBeInstanceOf(
            CreateCustomerUseCase.UseCase,
        );
        expect(controller['updateUseCase']).toBeInstanceOf(
            UpdateCustomerUseCase.UseCase,
        );
        expect(controller['deleteUseCase']).toBeInstanceOf(
            DeleteCustomerUseCase.UseCase,
        );
        expect(controller['listUseCase']).toBeInstanceOf(
            ListCustomersUseCase.UseCase,
        );
        expect(controller['getUseCase']).toBeInstanceOf(GetCustomerUseCase.UseCase);
    });

    describe('should create a customer', () => {
        const arrange = [
            {
                request: {
                    name: 'John Doe',
                    email: 'john2@mail.com',
                    password: 'Pass123456',
                },
                expectedPresenter: {
                    name: 'John Doe',
                    email: 'john2@mail.com',
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
            // }
        ];

        test.each(arrange)(
            'with request $request',
            async ({ request, expectedPresenter }) => {
                const presenter = await controller.create(request);
                const entity = await repository.findById(presenter.id);

                expect(entity).toMatchObject({
                    id: presenter.id,
                    name: expectedPresenter.name,
                    email: expectedPresenter.email,
                    is_active: expectedPresenter.is_active,
                    created_at: presenter.created_at,
                });

                expect(presenter.id).toBe(entity.id);
                expect(presenter.name).toBe(expectedPresenter.name);
                expect(presenter.email).toBe(expectedPresenter.email);
                expect(presenter.is_active).toBe(expectedPresenter.is_active);
                expect(presenter.created_at).toStrictEqual(entity.created_at);
            },
        );
    });
});

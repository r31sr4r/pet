import { CustomerRepository } from 'pet-core/customer/domain';
import {
    CreateCustomerUseCase,
    DeleteCustomerUseCase,
    GetCustomerUseCase,
    ListCustomersUseCase,
    UpdateCustomerUseCase,
} from 'pet-core/customer/application';
import { CustomerInMemoryRepository, CustomerSequelize } from 'pet-core/customer/infra';
import { getModelToken } from '@nestjs/sequelize'


export namespace CUSTOMER_PROVIDERS {
    export namespace REPOSITORIES {
        export const CUSTOMER_IN_MEMORY_REPOSITORY = {
            provide: 'CustomerInMemoryRepository',
            useClass: CustomerInMemoryRepository,
        };

        export const CUSTOMER_SEQUELIZE_REPOSITORY = {
            provide: 'CustomerSequelizeRepository',
            useFactory: (customerModel: typeof CustomerSequelize.CustomerModel) => {
                return new CustomerSequelize.CustomerSequelizeRepository(customerModel);

            },
            inject: [getModelToken(CustomerSequelize.CustomerModel)],
        };

        export const CUSTOMER_REPOSITORY = {
            provide: 'CustomerRepository',
            useExisting: 'CustomerSequelizeRepository',
        };
    }

    export namespace USE_CASES {
        export const CREATE_CUSTOMER = {
            provide: CreateCustomerUseCase.UseCase,
            useFactory: (customerRepo: CustomerRepository.Repository) => {
                return new CreateCustomerUseCase.UseCase(customerRepo);
            },
            inject: [REPOSITORIES.CUSTOMER_REPOSITORY.provide],
        };

        export const UPDATE_CUSTOMER = {
            provide: UpdateCustomerUseCase.UseCase,
            useFactory: (customerRepo: CustomerRepository.Repository) => {
                return new UpdateCustomerUseCase.UseCase(customerRepo);
            },
            inject: [REPOSITORIES.CUSTOMER_REPOSITORY.provide],
        };

        export const GET_CUSTOMER = {
            provide: GetCustomerUseCase.UseCase,
            useFactory: (customerRepo: CustomerRepository.Repository) => {
                return new GetCustomerUseCase.UseCase(customerRepo);
            },
            inject: [REPOSITORIES.CUSTOMER_REPOSITORY.provide],
        };

        export const LIST_CATEGORIES = {
            provide: ListCustomersUseCase.UseCase,
            useFactory: (customerRepo: CustomerRepository.Repository) => {
                return new ListCustomersUseCase.UseCase(customerRepo);
            },
            inject: [REPOSITORIES.CUSTOMER_REPOSITORY.provide],
        };

        export const DELETE_CUSTOMER = {
            provide: DeleteCustomerUseCase.UseCase,
            useFactory: (customerRepo: CustomerRepository.Repository) => {
                return new DeleteCustomerUseCase.UseCase(customerRepo);
            },
            inject: [REPOSITORIES.CUSTOMER_REPOSITORY.provide],
        };
    }
}

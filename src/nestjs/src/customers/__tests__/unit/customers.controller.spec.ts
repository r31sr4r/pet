import { SortDirection } from 'pet-core/dist/@seedwork/domain/repository/repository-contracts';
import {
    CreateCustomerUseCase,
    GetCustomerUseCase,
    ListCustomersUseCase,
    UpdateCustomerUseCase,
} from 'pet-core/customer/application';
import { CreateCustomerDto } from '../../dto/create-customer.dto';
import { UpdateCustomerDto } from '../../dto/update-customer.dto';
import { CustomersController } from '../../customers.controller';
import { CustomerPresenter } from '../../presenter/customer.presenter';

describe('CustomersController', () => {
    let controller: CustomersController;

    beforeEach(async () => {
        controller = new CustomersController();
    });

    it('should create a customer', async () => {
        const output: CreateCustomerUseCase.Output = {
            id: '3edaaad1-d538-4843-a6ef-9ebdaa69f10b',
            name: 'Paul McCartney',
            email: 'paul@mail.com',
            cellphone: '+55 (11) 99999-9999',
            cpf: '123.456.789-00',
            gender: 'Male',
            birth_date: null,
            pets: [],
            is_active: true,
            created_at: new Date(),
            updated_at: null
        };

        const mockCreateUseCase = {
            execute: jest.fn().mockReturnValue(Promise.resolve(output)),
        };

        //@ts-expect-error
        controller['createUseCase'] = mockCreateUseCase;

        const input: CreateCustomerDto = {
            name: 'Paul McCartney',
            email: 'paul@mail.com',     
            cellphone: '+55 (11) 99999-9999',
            cpf: '123.456.789-00',
            gender: 'Male',                   
            is_active: true,
        };

        const presenter = await controller.create(input);
        expect(mockCreateUseCase.execute).toHaveBeenCalledWith(input);
        expect(presenter).toBeInstanceOf(CustomerPresenter);
        expect(presenter).toStrictEqual(new CustomerPresenter(output));
    });

    it('shoult update a customer', async () => {
        const expectedOutput: UpdateCustomerUseCase.Output = {
            id: '3edaaad1-d538-4843-a6ef-9ebdaa69f10b',
            name: 'Paul McCartney',
            email: 'paul@mail.com',
            cellphone: '+55 (11) 99999-9999',
            cpf: '123.456.789-00',
            gender: null,
            birth_date: null,
            pets: [],
            is_active: true,
            created_at: new Date(),
            updated_at: null
        };

        const mockUpdateUseCase = {
            execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
        };

        //@ts-expect-error
        controller['updateUseCase'] = mockUpdateUseCase;

        const input: UpdateCustomerDto = {
            name: 'Paul McCartney',
            email: 'paul@mail.com',
            cellphone: '+55 (11) 99999-9999',
            cpf: '123.456.789-00',
            is_active: true,
        };

        const output = await controller.update(
            '3edaaad1-d538-4843-a6ef-9ebdaa69f10b',
            input,
        );

        expect(mockUpdateUseCase.execute).toHaveBeenCalledWith({
            id: '3edaaad1-d538-4843-a6ef-9ebdaa69f10b',
            ...input,
        });
        expect(expectedOutput).toStrictEqual(output);
    });

    it('should delete a customer', async () => {
        const expectedOutput = undefined;
        const mockDeleteUseCase = {
            execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
        };

        //@ts-expect-error
        controller['deleteUseCase'] = mockDeleteUseCase;
        const id = '3edaaad1-d538-4843-a6ef-9ebdaa69f10b';
        expect(controller.remove(id)).toBeInstanceOf(Promise);

        const output = await controller.remove(id);
        expect(mockDeleteUseCase.execute).toHaveBeenCalledWith({ id });
        expect(expectedOutput).toStrictEqual(output);
    });

    it('should get a pet', async () => {
        const id = '3edaaad1-d538-4843-a6ef-9ebdaa69f10b';
        const expectedOutput: GetCustomerUseCase.Output = {
            id: id,
            name: 'Paul McCartney',
            email: 'paul@mail.com',
            cellphone: '+55 (11) 99999-9999',
            cpf: '123.456.789-00',
            gender: null,
            birth_date: null,
            is_active: true,
            pets: [],
            created_at: new Date(),
            updated_at: null
        };
        const mockGetUseCase = {
            execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
        };
        //@ts-expect-error
        controller['getUseCase'] = mockGetUseCase;
        const output = await controller.findOne(id);
        expect(mockGetUseCase.execute).toHaveBeenCalledWith({ id });
        expect(expectedOutput).toStrictEqual(output);
    });

    it('should search customers with filter', async () => {
        const expectdOutput: ListCustomersUseCase.Output = {
            items: [
                {
                    id: '3edaaad1-d538-4843-a6ef-9ebdaa69f10b',
                    name: 'Paul McCartney',
                    email: 'paul@mail.com',
                    cellphone: '+55 (11) 99999-9999',
                    cpf: '123.456.789-00',
                    gender: 'Male',
                    birth_date: null,
                    pets: [],
                    is_active: true,
                    created_at: new Date(),
                    updated_at: null
                },
            ],
            current_page: 1,
            last_page: 1,
            per_page: 10,
            total: 1,
        };

        const mockListUseCase = {
            execute: jest.fn().mockReturnValue(Promise.resolve(expectdOutput)),
        };
        //@ts-expect-error
        controller['listUseCase'] = mockListUseCase;

        const searchParams = {
            page: 1,
            per_page: 10,
            sort: 'name',
            sort_dir: 'asc' as SortDirection,
            fiter: 'Paul',
        };

        const output = await controller.search(searchParams);

        expect(mockListUseCase.execute).toBeCalledWith(searchParams);
        expect(expectdOutput).toStrictEqual(output);
    });
});

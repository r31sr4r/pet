import { Customer } from '../../../../domain/entities/customer';
import NotFoundError from '../../../../../@seedwork/domain/errors/not-found.error';
import CustomerInMemoryRepository from '../../../../infra/db/in-memory/customer-in-memory.repository';
import { DeleteCustomerUseCase } from '../../delete-customer.use-case';

describe('DeleteCustomerUseCase Unit Tests', () => {
    let repository: CustomerInMemoryRepository;
    let useCase: DeleteCustomerUseCase.UseCase;

    beforeEach(() => {
        repository = new CustomerInMemoryRepository();
        useCase = new DeleteCustomerUseCase.UseCase(repository);
    });

    it('should throw an error when customer not found', async () => {
        await expect(useCase.execute({ id: 'fake id' })).rejects.toThrow(
            new NotFoundError('Entity not found using ID fake id')
        );
    });

    it('should delete a customer', async () => {
        const spyDelete = jest.spyOn(repository, 'delete');
        let items = [
            new Customer({
                name: 'Test Customer',
                email: 'test@mail.com'               
            }),
        ];
        repository.items = items;
        await useCase.execute({ id: items[0].id });
        expect(spyDelete).toHaveBeenCalledTimes(1);
        expect(repository.items.length).toBe(0);
    });

});
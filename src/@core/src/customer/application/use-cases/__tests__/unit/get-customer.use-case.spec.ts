import { Customer } from '../../../../domain/entities/customer';
import NotFoundError from '../../../../../@seedwork/domain/errors/not-found.error';
import CustomerInMemoryRepository from '../../../../infra/db/in-memory/customer-in-memory.repository';
import {GetCustomerUseCase} from '../../get-customer.use-case';

describe('GetCustomerUseCase Unit Tests', () => {
	let useCase: GetCustomerUseCase.UseCase;
	let repository: CustomerInMemoryRepository;

	beforeEach(() => {
		repository = new CustomerInMemoryRepository();
		useCase = new GetCustomerUseCase.UseCase(repository);
	});

	it('should throw an error when customer not found', async () => {
		await expect(useCase.execute({ id: 'fake id' })).rejects.toThrow(
			new NotFoundError('Entity not found using ID fake id')
		);
	});

	it('should return a customer', async () => {
		const spyFindById = jest.spyOn(repository, 'findById');
		let items = [
			new Customer({
				name: 'Toto',
                type: 'Dog',
			}),
		];
		repository.items = items;
		let output = await useCase.execute({ id: items[0].id });

		expect(spyFindById).toHaveBeenCalledTimes(1);
		expect(output).toStrictEqual({
			id: repository.items[0].id,
			name: 'Toto',
			type: 'Dog',
			breed: null,
			gender: null,
			is_active: true,
			birth_date: null,
			created_at: repository.items[0].created_at,
		});
	});


});

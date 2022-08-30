import { Pet } from '#pet/domain';
import CustomerInMemoryRepository from '../../../../infra/db/in-memory/customer-in-memory.repository';
import { CreateCustomerUseCase } from '../../create-customer.use-case';

describe('CreateCustomerUseCase Unit Tests', () => {
	let useCase: CreateCustomerUseCase.UseCase;
	let repository: CustomerInMemoryRepository;

	beforeEach(() => {
		repository = new CustomerInMemoryRepository();
		useCase = new CreateCustomerUseCase.UseCase(repository);
	});

	it('should create a new customer', async () => {
		const spyInsert = jest.spyOn(repository, 'insert');
		let output = await useCase.execute({
			name: 'John Doe',
			email: 'somemail@mail.com',
			cellphone: '+55 (11) 99999-9999',
		});

		expect(spyInsert).toHaveBeenCalledTimes(1);
		expect(output).toStrictEqual({
			id: repository.items[0].id,
			name: 'John Doe',
			email: 'somemail@mail.com',
			cellphone: '+55 (11) 99999-9999',
			cpf: null,
			gender: null,
			is_active: true,
			birth_date: null,
			created_at: repository.items[0].created_at,
			updated_at: null,
		});

		output = await useCase.execute({
			name: 'John Doe',
			email: 'somemail@mail.com',
			gender: 'Male',
			is_active: false,
			birth_date: new Date('2021-04-06'),
		});

		expect(spyInsert).toHaveBeenCalledTimes(2);
		expect(output).toMatchObject({
			id: repository.items[1].id,
			name: 'John Doe',
			email: 'somemail@mail.com',
			cellphone: null,
			cpf: null,
			gender: 'Male',
			is_active: false,
			birth_date: new Date('2021-04-06'),
			created_at: repository.items[1].created_at,
			updated_at: null,
		});
	});

	it('should throw an error if props is not provided', async () => {
		await expect(useCase.execute(null as any)).rejects.toThrow(
			'Entity validation error'
		);
	});

	it('should throw an error if name is not provided', async () => {
		await expect(useCase.execute(null as any)).rejects.toMatchObject({
			error: {
				name: [
					'name should not be empty',
					'name must be a string',
					'name must be longer than or equal to 3 characters',
					'name must be shorter than or equal to 255 characters',
				],
			},
		});

		await expect(
			useCase.execute({ name: '' } as any)
		).rejects.toMatchObject({
			error: {
				name: [
					'name should not be empty',
					'name must be longer than or equal to 3 characters',
				],
			},
		});
	});

	it('should throw an error if email is not provided', async () => {
		await expect(
			useCase.execute({
				name: 'Test',
				email: null as any,
			})
		).rejects.toMatchObject({
			error: {
				email: [
					'email should not be empty',
					'email must be a string',
					'email must be shorter than or equal to 255 characters',
					'email must be an email',
				],
			},
		});
	});
});

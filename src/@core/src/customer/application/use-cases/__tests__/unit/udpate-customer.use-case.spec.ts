import CustomerInMemoryRepository from '../../../../infra/db/in-memory/customer-in-memory.repository';
import {UpdateCustomerUseCase} from '../../update-customer.use-case';
import NotFoundError from '../../../../../@seedwork/domain/errors/not-found.error';
import { Customer } from '../../../../domain/entities/customer';

describe('UpdateCustomerUseCase Unit Tests', () => {
	let useCase: UpdateCustomerUseCase.UseCase;
	let repository: CustomerInMemoryRepository;

	beforeEach(() => {
		repository = new CustomerInMemoryRepository();
		useCase = new UpdateCustomerUseCase.UseCase(repository);
	});

	it('should throw an error when customer not found', async () => {
		await expect(
			useCase.execute({ id: 'fake id', name: 'some name', type: 'fish' })
		).rejects.toThrow(
			new NotFoundError('Entity not found using ID fake id')
		);
	});

	it('should update a customer', async () => {
		type Arrange = {
			input: {
				id: string;
				name: string;
				type: string;
				breed?: string | null;
				gender?: string | null;
				is_active?: boolean | null;
				birth_date?: Date | null;
			};
			expected: {
				id: string;
				name: string;
				type: string;
				breed: string;
				gender?: string;
				is_active: boolean;
				birth_date?: Date;
				created_at?: Date;
			};
		};

		const spyUpdate = jest.spyOn(repository, 'update');
		const entity = new Customer({
			name: 'Toto',
			type: 'Dog',
		});
		repository.items = [entity];

		const arrange: Arrange[] = [
			{
				input: {
					id: entity.id,
					name: 'Titi',
					type: 'Dog',
					breed: 'Labrador',
				},
				expected: {
					id: entity.id,
					name: 'Titi',
					type: 'Dog',
					breed: 'Labrador',
                    gender: null,
					is_active: true,
					birth_date: null,
					created_at: entity.created_at,
				},
			},
			{
				input: {
					id: entity.id,
					name: 'Garfield',
					type: 'Cat',
				},
				expected: {
					id: entity.id,
					name: 'Garfield',
					type: 'Cat',
					breed: null,
                    gender: null,                    
					is_active: true,
					birth_date: null,
					created_at: entity.created_at,
				},
			},
			{
				input: {
					id: entity.id,
					name: 'Beta',
					type: 'Fish',
					is_active: false,
					birth_date: new Date('2020-01-01'),
				},
				expected: {
					id: entity.id,
					name: 'Beta',
					type: 'Fish',
					breed: null,
                    gender: null,     
					is_active: false,
					birth_date: new Date('2020-01-01'),
					created_at: entity.created_at,
				},
			},
			{
				input: {
					id: entity.id,
					name: 'Taco',
					type: 'Dog',
				},
				expected: {
					id: entity.id,
					name: 'Taco',
					type: 'Dog',
					breed: null,
                    gender: null,
					is_active: false,
					birth_date: null,
					created_at: entity.created_at,
				},
			},
			{
				input: {
					id: entity.id,
					name: 'Taco',
					type: 'Dog',
                    breed: 'Labrador',
                    gender: 'Male',
                    is_active: true
                    
				},
				expected: {
					id: entity.id,
					name: 'Taco',
					type: 'Dog',
					breed: 'Labrador',
                    gender: 'Male',
					is_active: true,
					birth_date: null,
					created_at: entity.created_at,
				},
			},            
        
		];

		let output = await useCase.execute({
			id: entity.id,
			name: 'Toto',
			type: 'Dog',
		});
		expect(output).toStrictEqual({
			id: entity.id,
			name: 'Toto',
			type: 'Dog',
			breed: null,
			gender: null,
			is_active: true,
			birth_date: null,
			created_at: entity.created_at,
		});
		expect(spyUpdate).toHaveBeenCalledTimes(1);

		for (const item of arrange) {
			output = await useCase.execute({
				id: item.input.id,
				name: item.input.name,
				type: item.input.type,
				breed: item.input.breed,
				gender: item.input.gender,
				is_active: item.input.is_active,
				birth_date: item.input.birth_date,
			});
			expect(output).toStrictEqual({
				id: entity.id,
				name: item.expected.name,
				type: item.expected.type,
				breed: item.expected.breed,
				gender: item.expected.gender,
				is_active: item.expected.is_active,
				birth_date: item.expected.birth_date,
				created_at: item.expected.created_at,
			});
		}
	});
});

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
			useCase.execute({ id: 'fake id', name: 'some name', email: 'somemail@mail.com' })
		).rejects.toThrow(
			new NotFoundError('Entity not found using ID fake id')
		);
	});

	it('should update a customer', async () => {
		type Arrange = {
			input: {
				id: string;
				name: string;
				email: string;
				cellphone?: string | null;
				cpf?: string | null;
				gender?: string | null;
				is_active?: boolean | null;
				birth_date?: Date | null;
			};
			expected: {
				id: string;
				name: string;
				email: string;
				cellphone?: string;
				cpf?: string;
				gender?: string;
				is_active: boolean;
				birth_date?: Date;
				created_at?: Date;
			};
		};

		const spyUpdate = jest.spyOn(repository, 'update');
		const entity = new Customer({
			name: 'Customer 1',
			email: 'somemail@mail.com'
		});
		repository.items = [entity];

		const arrange: Arrange[] = [
			{
				input: {
					id: entity.id,
					name: 'Customer 1',
					email: 'somemail2@mail.com',
					cellphone: '99999999999',
				},
				expected: {
					id: entity.id,
					name: 'Customer 1',
					email: 'somemail2@mail.com',
					cellphone: '99999999999',
					cpf: null,
                    gender: null,
					is_active: true,
					birth_date: null,
					created_at: entity.created_at,
				},
			},
			{
				input: {
					id: entity.id,
					name: 'Customer 1',
					email: 'somemail2@mail.com',
					cellphone: '99999999999',
					cpf: '123.456.789-10',
				},
				expected: {
					id: entity.id,
					name: 'Customer 1',
					email: 'somemail2@mail.com',
					cellphone: '99999999999',
					cpf: '123.456.789-10',
                    gender: null,                    
					is_active: true,
					birth_date: null,
					created_at: entity.created_at,
				},
			},
			{
				input: {
					id: entity.id,
					name: 'Customer 1',
					email: 'somemail2@mail.com',
					cellphone: '99999999999',
					cpf: '123.456.789-10',
					is_active: false,
					birth_date: new Date('2020-01-01'),
				},
				expected: {
					id: entity.id,
					name: 'Customer 1',
					email: 'somemail2@mail.com',
					cellphone: '99999999999',
					cpf: '123.456.789-10',
                    gender: null,     
					is_active: false,
					birth_date: new Date('2020-01-01'),
					created_at: entity.created_at,
				},
			},
			{
				input: {
					id: entity.id,
					name: 'Customer 1',
					email: 'somemail2@mail.com',
					cellphone: '99999999999',
					cpf: '123.456.789-10',
					gender: 'Male'
				},
				expected: {
					id: entity.id,
					name: 'Customer 1',
					email: 'somemail2@mail.com',
					cellphone: '99999999999',
					cpf: '123.456.789-10',
					gender: 'Male',
					is_active: false,
					birth_date: null,
					created_at: entity.created_at,
				},
			},
			{
				input: {
					id: entity.id,
					name: 'Customer 1',
					email: 'somemail2@mail.com',
					cellphone: '99999999999',
					cpf: '123.456.789-10',
                    gender: 'Male',
                    is_active: true
                    
				},
				expected: {
					id: entity.id,
					name: 'Customer 1',
					email: 'somemail2@mail.com',
					cellphone: '99999999999',
					cpf: '123.456.789-10',
                    gender: 'Male',
					is_active: true,
					birth_date: null,
					created_at: entity.created_at,
				},
			},            
        
		];

		let output = await useCase.execute({
			id: entity.id,
			name: 'Customer 1',
			email: 'mail@mail.com',
		});
		expect(output).toStrictEqual({
			id: entity.id,
			name: 'Customer 1',
			email: 'mail@mail.com',
			cellphone: null,
			cpf: null,			
			gender: null,
			is_active: true,
			birth_date: null,
			created_at: entity.created_at,
			updated_at: entity.updated_at
		});
		expect(spyUpdate).toHaveBeenCalledTimes(1);

		for (const item of arrange) {
			output = await useCase.execute({
				id: item.input.id,
				name: item.input.name,
				email: item.input.email,
				cellphone: item.input.cellphone,
				cpf: item.input.cpf,				
				gender: item.input.gender,
				is_active: item.input.is_active,
				birth_date: item.input.birth_date,
			});
			expect(output).toStrictEqual({
				id: entity.id,
				name: item.expected.name,
				email: item.expected.email,
				cellphone: item.expected.cellphone,
				cpf: item.expected.cpf,				
				gender: item.expected.gender,
				is_active: item.expected.is_active,
				birth_date: item.expected.birth_date,
				created_at: item.expected.created_at,
				updated_at: entity.updated_at
			});
		}
	});
});

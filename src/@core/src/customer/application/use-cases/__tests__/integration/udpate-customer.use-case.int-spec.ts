import { UpdateCustomerUseCase } from '../../update-customer.use-case';
import NotFoundError from '../../../../../@seedwork/domain/errors/not-found.error';
import { setupSequelize } from '#seedwork/infra';
import { CustomerSequelize } from '#customer/infra/db/sequelize/customer-sequelize';
import _chance from 'chance';
import { PetSequelize } from '#pet/infra';

const chance = _chance();

const { CustomerSequelizeRepository, CustomerModel } = CustomerSequelize;

describe('UpdateCustomerUseCase Integration Tests', () => {
	let useCase: UpdateCustomerUseCase.UseCase;
	let repository: CustomerSequelize.CustomerSequelizeRepository;

	setupSequelize({ models: [CustomerModel, PetSequelize.PetModel] });

	beforeEach(() => {
		repository = new CustomerSequelizeRepository(CustomerModel);
		useCase = new UpdateCustomerUseCase.UseCase(repository);
	});

	it('should throw an error when customer not found', async () => {
		await expect(
			useCase.execute({
				id: 'fake id',
				name: 'some name',
				email: 'somemail@mail.com',
			})
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

		const entity = await CustomerModel.factory().create();

		const arrange: Arrange[] = [
			{
				input: {
					id: entity.id,
					name: 'Customer 1',
					email: 'somemail2@mail.com',
					cellphone: '99999999999',
					is_active: entity.is_active,
				},
				expected: {
					id: entity.id,
					name: 'Customer 1',
					email: 'somemail2@mail.com',
					cellphone: '99999999999',
					cpf: null,
                    gender: null,
					is_active: entity.is_active,
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
					is_active: entity.is_active,
				},
				expected: {
					id: entity.id,
					name: 'Customer 1',
					email: 'somemail2@mail.com',
					cellphone: '99999999999',
					cpf: '123.456.789-10',
                    gender: null,                    
					is_active: entity.is_active,
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
			is_active: entity.is_active,
			birth_date: null,
			created_at: entity.created_at,
			updated_at: output.updated_at,
		});

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
				updated_at: output.updated_at
			});
		}
	});
});

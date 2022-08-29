import { Customer } from '#customer/domain';
import { Pet } from '#pet/domain';
import { PetSequelize } from '#pet/infra';
import { LoadEntityError, UniqueEntityId } from '#seedwork/domain';
import { setupSequelize } from '#seedwork/infra/testing/helpers/db';
import { CustomerSequelize } from '../customer-sequelize';

const { CustomerModel, CustomerModelMapper} = CustomerSequelize;


describe('CustomerMapper Unit Tests', () => {
	setupSequelize({models: [CustomerModel , PetSequelize.PetModel]});

	it('should throw an error when entity is invalid', async () => {
		const model = CustomerModel.build({
			id: '02b090cf-5658-4073-b242-9bf64915b3ad',
		});
        try {
            CustomerModelMapper.toEntity(model);
            fail('The customer is valid but an error was expected');            
        } catch (err) {
            expect(err).toBeInstanceOf(LoadEntityError);            
            expect(err.error).toMatchObject({
                name: [
                    'name should not be empty',
                    'name must be a string',
					'name must be longer than or equal to 3 characters',
                    'name must be shorter than or equal to 255 characters',
                ]
            });
            expect(err.message).toBe('An entity could not be loaded');            
        }
	});


	it('should throw a generic error', async () => {
		const error = new Error('An error has occurred');
		const spyValidate = jest
			.spyOn(Customer, 'validate')
			.mockImplementation(() => {
				throw error;
			});
		const model = CustomerModel.build({
			id: '02b090cf-5658-4073-b242-9bf64915b3ad',
		});

		expect(() => CustomerModelMapper.toEntity(model)).toThrow(error);
		expect(spyValidate).toHaveBeenCalled();
		spyValidate.mockRestore();
	});

	it('should map a customer model to a customer', async () => {
		const created_at = new Date();
		const model = CustomerModel.build({
			id: '02b090cf-5658-4073-b242-9bf64915b3ad',
			name: 'Customer 1',
			email: 'customer1@mail.com',
			cellphone: '5511999999999',
			cpf: '123.456.789-01',
			is_active: true,
			created_at,
		});
        
		const entity = CustomerModelMapper.toEntity(model);

		expect(entity.toJSON()).toStrictEqual(
			new Customer(
				{
					name: 'Customer 1',
					email: 'customer1@mail.com',
					cellphone: '5511999999999',
					cpf: '123.456.789-01',
					is_active: true,
					created_at,
				},
				new UniqueEntityId('02b090cf-5658-4073-b242-9bf64915b3ad')
			).toJSON()
		);
	});

	it('should map a customer with pet model to a customer', async () => {
		const created_at = new Date();

		const pet1 = new Pet({
			name: 'Pet 1',
			type: 'dog',
			customer_id: '02b090cf-5658-4073-b242-9bf64915b3ad',
		})

		const model = CustomerModel.build({
			id: '02b090cf-5658-4073-b242-9bf64915b3ad',
			name: 'Customer 1',
			email: 'customer1@mail.com',
			cellphone: '5511999999999',
			cpf: '123.456.789-01',
			is_active: true,
			pets: [pet1],
			created_at,
		});
       
		const entity = CustomerModelMapper.toEntity(model);

		expect(entity.toJSON()).toStrictEqual(
			new Customer(
				{
					name: 'Customer 1',
					email: 'customer1@mail.com',
					cellphone: '5511999999999',
					cpf: '123.456.789-01',
					is_active: true,
					created_at,
				},
				new UniqueEntityId('02b090cf-5658-4073-b242-9bf64915b3ad')
			).toJSON()
		);
	});	
});

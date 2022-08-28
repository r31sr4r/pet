import { Pet } from '#pet/domain';
import { UniqueEntityId } from '#seedwork/domain';
import { Customer } from '../../domain/entities/customer';
import { CustomerOutputMapper } from './customer-output';

describe('CustomerOutput Unit Tests', () => {
	describe('CustomerOutputMapper Unit Tests', () => {
		it('should convert a customer to output', () => {
			const created_at = new Date();
			let customer = new Customer({
				name: 'Customer 1',
				email: 'somemail@mail.com',
				cellphone: '+55 (11) 99999-9999',
				cpf: '123.456.789-00',
				gender: 'Female',
				birth_date: new Date('2022-04-02'),
				is_active: true,
				created_at,
			});

			const spyToJSON = jest.spyOn(customer, 'toJSON');
			let output = CustomerOutputMapper.toOutput(customer);

			expect(spyToJSON).toHaveBeenCalled();
			expect(output).toStrictEqual({
				id: customer.id,
				name: 'Customer 1',
				email: 'somemail@mail.com',
				cellphone: '+55 (11) 99999-9999',
				cpf: '123.456.789-00',
				gender: 'Female',
				birth_date: customer.birth_date,
				is_active: true,
				created_at,
				updated_at: null,
			});

            const id_pet1 = '1288ae2e-502c-4999-8834-ca461e56a01c'
			const pet1 = new Pet({
				name: 'Pet 1',
				type: 'Dog',
                created_at,
			}, new UniqueEntityId(id_pet1));

            const id_pet2 = '2ad4af70-4097-46f0-b6a0-c8dad7f4225b'
			const pet2 = new Pet({
				name: 'Pet 2',
				type: 'Cat',
                created_at,
			}, new UniqueEntityId(id_pet2));

			customer = new Customer({
				name: 'Customer 1',
				email: 'somemail@mail.com',
				cellphone: '+55 (11) 99999-9999',
				cpf: '123.456.789-00',
				gender: 'Female',
				birth_date: new Date('2022-04-02'),
				is_active: true,
				pets: [pet1, pet2],
				created_at,
			});

			output = CustomerOutputMapper.toOutput(customer);

			expect(spyToJSON).toHaveBeenCalled();
			expect(output).toMatchObject({
				id: customer.id,
				name: 'Customer 1',
				email: 'somemail@mail.com',
				cellphone: '+55 (11) 99999-9999',
				cpf: '123.456.789-00',
				gender: 'Female',
				birth_date: customer.birth_date,
				is_active: true,
				pets: [
					{
						birth_date: null,
						breed: null,
						created_at,
						gender: null,
						is_active: true,
						name: 'Pet 1',
						type: 'Dog',
					},
					{
						birth_date: null,
						breed: null,
						created_at,
						gender: null,
						is_active: true,
						name: 'Pet 2',
						type: 'Cat',
					},
				],
				created_at,
				updated_at: null,
			});
		});
	});
});

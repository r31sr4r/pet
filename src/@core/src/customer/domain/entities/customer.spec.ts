import { Customer, CustomerProperties } from './customer';
import { omit } from 'lodash';
import UniqueEntityId from '#seedwork/domain/value-objects/unique-entity-id.vo';
import { Pet } from '#pet/domain';

describe('Customer Unit Tests', () => {
	beforeEach(() => {
		Customer.validate = jest.fn();
	});

	test('constructor of Customer', () => {
		let customer = new Customer(
			{
				name: 'Jean-Paul Sartre',
				email: 'jeanps@mail.com',
			},
			new UniqueEntityId('f258cce8-6e03-4f85-81f9-172666c417e5')
		);
		let props = omit(customer.props, [
			'created_at',
			'birth_date',
			'updated_at',
		]);
		expect(Customer.validate).toHaveBeenCalled();
		expect(props).toStrictEqual({
			name: 'Jean-Paul Sartre',
			email: 'jeanps@mail.com',
			cellphone: null,
			cpf: null,
			gender: null,
			is_active: true,
		});

		customer = new Customer(
			{
				name: 'Jean-Paul Sartre',
				email: 'jeanps@mail.com',
				cellphone: '(11) 99999-9999',
			},
			new UniqueEntityId('f258cce8-6e03-4f85-81f9-172666c417e5')
		);
		props = omit(customer.props, ['created_at', 'updated_at' ]);
		expect(Customer.validate).toHaveBeenCalledTimes(2);
		expect(props).toStrictEqual({
			name: 'Jean-Paul Sartre',
			email: 'jeanps@mail.com',
			cellphone: '(11) 99999-9999',
			cpf: null,
			gender: null,
			birth_date: null,
			is_active: true,
		});

		customer = new Customer({
			name: 'Jean-Paul Sartre',
			email: 'jeanps@mail.com',
			cellphone: '(11) 99999-9999',
			cpf: '12345678900',
		});
		props = omit(customer.props, ['created_at', 'updated_at']);
		expect(props).toStrictEqual({
			name: 'Jean-Paul Sartre',
			email: 'jeanps@mail.com',
			cellphone: '(11) 99999-9999',
			cpf: '12345678900',
			gender: null,
			birth_date: null,
			is_active: true,
		});

		customer = new Customer({
			name: 'Jean-Paul Sartre',
			email: 'jeanps@mail.com',
			cellphone: '(11) 99999-9999',
			cpf: '12345678900',
			gender: 'Male',
		});
		props = omit(customer.props, ['created_at', 'updated_at']);
		expect(props).toStrictEqual({
			name: 'Jean-Paul Sartre',
			email: 'jeanps@mail.com',
			cellphone: '(11) 99999-9999',
			cpf: '12345678900',
			gender: 'Male',
			birth_date: null,
			is_active: true,
		});

		let created_at = new Date();
		customer = new Customer({
			name: 'Jean-Paul Sartre',
			email: 'jeanps@mail.com',
			cellphone: '(11) 99999-9999',
			created_at,
		});
		props = omit(customer.props, ['updated_at']);
		expect(props).toStrictEqual({
			name: 'Jean-Paul Sartre',
			email: 'jeanps@mail.com',
			cellphone: '(11) 99999-9999',
			cpf: null,
			gender: null,
			birth_date: null,
			is_active: true,
			created_at,
		});

		let birth_date = new Date('2020-01-01');
		created_at = new Date();
		customer = new Customer({
			name: 'Jean-Paul Sartre',
			email: 'jeanps@mail.com',
			is_active: false,
			birth_date,
			created_at,
		});
		props = omit(customer.props, ['updated_at']);
		expect(props).toStrictEqual({
			name: 'Jean-Paul Sartre',
			email: 'jeanps@mail.com',
			cellphone: null,
			cpf: null,
			gender: null,
			birth_date,
			is_active: false,
			created_at,
		});

		let pet1 = new Pet({
			name: 'Puppy',
			type: 'Dog',
			breed: 'Poodle',
			customer_id: 'f258cce8-6e03-4f85-81f9-172666c417e5',
		})

		let pet2 = new Pet({
			name: 'Garfield',
			type: 'Cat',
			breed: 'Orange',
			customer_id: 'f258cce8-6e03-4f85-81f9-172666c417e5',
		})

		birth_date = new Date('2020-01-01');
		created_at = new Date();
		customer = new Customer({
			name: 'Jean-Paul Sartre',
			email: 'jeanp@mail.com',
			cellphone: '(11) 99999-9999',
			cpf: '12345678900',
			birth_date,
			created_at,
			pets: [pet1, pet2],
		}, new UniqueEntityId('f258cce8-6e03-4f85-81f9-172666c417e5'));

		props = omit(customer.props, ['updated_at']);
		expect(props).toStrictEqual({
			name: 'Jean-Paul Sartre',
			email: 'jeanp@mail.com',
			cellphone: '(11) 99999-9999',
			cpf: '12345678900',
			gender: null,
			birth_date,
			is_active: true,
			pets: [pet1, pet2],
			created_at,
		});
	});

	test('id field', () => {
		type CustomerData = { props: CustomerProperties; id?: UniqueEntityId };
		const data: CustomerData[] = [
			{ props: { name: 'Joey Ramone', email: 'joeyr@mail.com' } },
			{
				props: { name: 'Joey Ramone', email: 'joeyr@mail.com' },
				id: null,
			},
			{
				props: { name: 'Joey Ramone', email: 'joeyr@mail.com' },
				id: undefined,
			},
			{
				props: { name: 'Joey Ramone', email: 'joeyr@mail.com' },
				id: new UniqueEntityId(),
			},
			{
				props: { name: 'Joey Ramone', email: 'joeyr@mail.com' },
				id: new UniqueEntityId('8767ebd9-a65b-4061-8d5f-3fb0d3a10d09'),
			},
		];

		data.forEach((item) => {
			const customer = new Customer(item.props, item.id);
			expect(customer.id).not.toBeNull();
		});
	});

	test('getter and setter of name prop', () => {
		let customer = new Customer({
			name: 'Animal Boy',
			email: 'animal@mail.com',
		});
		expect(customer.name).toBe('Animal Boy');

		customer['name'] = 'Joey Ramone';
		expect(customer.name).toBe('Joey Ramone');
	});

	test('getter and setter of email prop', () => {
		let customer = new Customer({
			name: 'Joey Ramone',
			email: 'joeyr@mail.com',
		});
		expect(customer.email).toBe('joeyr@mail.com');

		customer['email'] = 'joey.ramone@mail.com';
		expect(customer.email).toBe('joey.ramone@mail.com');
	});

	test('getter and setter of cellphone prop', () => {
		let customer = new Customer({
			name: 'Joey Ramone',
			email: 'joeyr@mail.com',
		});
		expect(customer.cellphone).toBeNull();

		customer['cellphone'] = '(11) 99999-9999';
		expect(customer.cellphone).toBe('(11) 99999-9999');

		customer = new Customer({
			name: 'Joey Ramone',
			email: 'joeyr@mail.com',
			cellphone: '(61) 99999-9999',
		});
		expect(customer.cellphone).toBe('(61) 99999-9999');

		customer = new Customer({
			name: 'Joey Ramone',
			email: 'joeyr@mail.com',
		});
		customer['cellphone'] = undefined;
		expect(customer.cellphone).toBeNull();
	});

	test('getter and setter of cpf prop', () => {
		let customer = new Customer({
			name: 'Joey Ramone',
			email: 'joeyr@mail.com',
		});
		expect(customer.cpf).toBeNull();

		customer['cpf'] = '12345678900';
		expect(customer.cpf).toBe('12345678900');

		customer = new Customer({
			name: 'Joey Ramone',
			email: 'joeyr@mail.com',
			cpf: '12345678999',
		});
		expect(customer.cpf).toBe('12345678999');

		customer['cpf'] = undefined;
		expect(customer.cpf).toBeNull();
	});

	test('getter and setter of gender prop', () => {
		let customer = new Customer({
			name: 'Joey Ramone',
			email: 'joeyr@mail.com',
		});
		expect(customer.gender).toBeNull();

		customer['gender'] = 'Male';
		expect(customer.gender).toBe('Male');

		customer = new Customer({
			name: 'Joey Ramone',
			email: 'joeyr@mail.com',
			gender: 'Male',
		});
		expect(customer.gender).toBe('Male');

		customer['gender'] = undefined;
		expect(customer.gender).toBeNull();
	});

	test('getter and setter of birth_date prop', () => {
		let customer = new Customer({
			name: 'Joey Ramone',
			email: 'joeyr@mail.com',
		});
		expect(customer.birth_date).toBe(null);

		let birth_date = new Date('2020-01-01');
		customer = new Customer({
			name: 'Joey Ramone',
			email: 'joeyr@mail.com',
			birth_date,
		});
		expect(customer.birth_date).toBe(birth_date);

		birth_date = new Date('2021-03-01');
		customer = new Customer({
			name: 'Joey Ramone',
			email: 'joeyr@mail.com',
		});
		customer['birth_date'] = birth_date;
		expect(customer.birth_date).toBe(birth_date);
		customer['birth_date'] = undefined;
		expect(customer.birth_date).toBeNull();
		customer['birth_date'] = null;
		expect(customer.birth_date).toBeNull();
	});

	test('getter and setter of is_active prop', () => {
		let customer = new Customer({
			name: 'Joey Ramone',
			email: 'joeyr@mail.com',
		});
		expect(customer.is_active).toBeTruthy();

		customer = new Customer({
			name: 'Joey Ramone',
			email: 'joeyr@mail.com',
			is_active: false,
		});
		expect(customer.is_active).toBeFalsy();

		customer = new Customer({
			name: 'Joey Ramone',
			email: 'joeyr@mail.com',
		});
		customer['is_active'] = false;
		expect(customer.is_active).toBeFalsy();
		customer['is_active'] = undefined;
		expect(customer.is_active).toBeTruthy();
		customer['is_active'] = null;
		expect(customer.is_active).toBeTruthy();
	});

	test('getter and setter of created_at prop', () => {
		let customer = new Customer({
			name: 'Joey Ramone',
			email: 'joeyr@mail.com',
		});
		expect(customer.created_at).toBeInstanceOf(Date);

		customer = new Customer({
			name: 'Joey Ramone',
			email: 'joeyr@mail.com',
			created_at: new Date(),
		});
		expect(customer.created_at).toBeInstanceOf(Date);
	});

	test('getter and setter of updated_at prop', () => {
		let customer = new Customer({
			name: 'Joey Ramone',
			email: 'joeyr@mail.com',
			updated_at: new Date(),
		});
		expect(customer.updated_at).toBeInstanceOf(Date);

		const updated_at = new Date('2020-01-01');
		customer = new Customer({
			name: 'Joey Ramone',
			email: 'joeyr@mail.com',
			updated_at: updated_at,
		});
		expect(customer.updated_at).toBe(updated_at);

		customer['updated_at'] = new Date('2021-03-01');
		expect(customer.updated_at).toBeInstanceOf(Date);
	});

	it('should deactivate a customer', () => {
		let customer = new Customer({
			name: 'Joey Ramone',
			email: 'joeyr@mail.com',
		});
		expect(customer.is_active).toBeTruthy();
		customer.deactivate();
		expect(customer.is_active).toBeFalsy();
		expect(customer).toMatchObject({
			name: 'Joey Ramone',
			email: 'joeyr@mail.com',
			is_active: false,
		});
	});

	it('should activate a customer', () => {
		let customer = new Customer({
			name: 'Joey Ramone',
			email: 'joeyr@mail.com',
			is_active: false,
		});
		expect(customer.is_active).toBeFalsy();
		customer.activate();
		expect(customer.is_active).toBeTruthy();
		expect(customer).toMatchObject({
			name: 'Joey Ramone',
			email: 'joeyr@mail.com',
			is_active: true,
		});
	});

	it('should update a customer', () => {
		let customer = new Customer({
			name: 'Joey Ramone',
			email: 'joeyr@mail.com',
		});
		expect(customer.is_active).toBeTruthy();
		customer.update(
			'Jeffrey Ross Hyman',
			'jeffrey@mail.com',
			customer.cellphone,
			customer.cpf,
			customer.gender,
			customer.birth_date,
		);
		expect(Customer.validate).toHaveBeenCalledTimes(2);
		expect(customer).toMatchObject({
			name: 'Jeffrey Ross Hyman',
			email: 'jeffrey@mail.com',
			is_active: true,
		});
	});

	it('should update a customer with new birth_date', () => {
		let customer = new Customer({
			name: 'Joey Ramone',
			email: 'joeyr@mail.com',
		});
		expect(customer.is_active).toBeTruthy();
		let birth_date = new Date('2020-01-01');
		customer.update(
			'Jeffrey Ross Hyman',
			'jeffrey@mail.com',
			customer.cellphone,
			customer.cpf,
			customer.gender,
			birth_date
		);
		expect(Customer.validate).toHaveBeenCalledTimes(2);
		expect(customer).toMatchObject({
			name: 'Jeffrey Ross Hyman',
			email: 'jeffrey@mail.com',
			is_active: true,
			birth_date,
		});
		expect(customer.birth_date).toBe(birth_date);
	});
});

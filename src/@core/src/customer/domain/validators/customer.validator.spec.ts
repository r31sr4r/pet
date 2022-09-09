import CustomerValidatorFactory, {
	CustomerRules,
	CustomerValidator,
} from './customer.validator';

describe('Customer Validator Tests', () => {
	let validator: CustomerValidator;

	beforeEach(() => (validator = CustomerValidatorFactory.create()));

	test('invalidation cases for name field', () => {
		expect({ validator, data: null }).containsErrorMessages({
			name: [
				'name should not be empty',
				'name must be a string',
				'name must be longer than or equal to 3 characters',
				'name must be shorter than or equal to 255 characters',
			],
		});

		expect({
			validator,
			data: { name: '' },
		}).containsErrorMessages({
			name: [
				'name should not be empty',
				'name must be longer than or equal to 3 characters',
			],
		});

		expect({
			validator,
			data: { name: 'ab' },
		}).containsErrorMessages({
			name: ['name must be longer than or equal to 3 characters'],
		});

		expect({
			validator,
			data: { name: 'a'.repeat(256) },
		}).containsErrorMessages({
			name: ['name must be shorter than or equal to 255 characters'],
		});
	});

	test('invalidation cases for email field', () => {
		expect({
			validator,
			data: { name: 'Some name', email: '' },
		}).containsErrorMessages({
			email: ['email should not be empty', 'email must be an email'],
		});

		expect({
			validator,
			data: { name: 'Some name', email: 'not an email' },
		}).containsErrorMessages({
			email: ['email must be an email'],
		});

		expect({
			validator,
			data: { name: 'Some name', email: `${'a'.repeat(256)}@gmail.com` },
		}).containsErrorMessages({
			email: [
				'email must be shorter than or equal to 255 characters',
				'email must be an email',
			],
		});
	});

	test('invalidation cases for cellphone field', () => {
		expect({
			validator,
			data: { name: 'Some name', email: 'mail@mail.com', cellphone: '' },
		}).containsErrorMessages({
			cellphone: ['cellphone must be a phone number'],
		});

		expect({
			validator,
			data: {
				name: 'Some name',
				email: 'mail@mail.com',
				cellphone: '+55 (11) 98985-6561',
			},
		}).containsErrorMessages({
			cellphone: ['cellphone must be a phone number'],
		});
	});

	test('invalidation cases for cpf field', () => {
		expect({
			validator,
			data: {
				name: 'Some name',
				email: 'mail@mail.com',
				cellphone: '+55 (11) 98985-6561',
				cpf: '',
			},
		}).containsErrorMessages({
			cpf: ['Incorrect format for cpf. Expected: xxxxxxxxxxx'],
		});

		expect({
			validator,
			data: {
				name: 'Some name',
				email: 'mail@mail.com',
				cellphone: '+55 (11) 98985-6561',
				cpf: '999.999.999.',
			},
		}).containsErrorMessages({
			cpf: ['Incorrect format for cpf. Expected: xxxxxxxxxxx'],
		});

		expect({
			validator,
			data: {
				name: 'Some name',
				email: 'mail@mail.com',
				cellphone: '+55 (11) 98985-6561',
				cpf: '999.999.999-99',
			},
		}).containsErrorMessages({
			cpf: ['Incorrect format for cpf. Expected: xxxxxxxxxxx'],
		});		
	});

	test('invalidation cases for gender field', () => {
        expect({
            validator,
            data: { name: 'Some name', email: 'somemail@some.com', gender: true },
        }).containsErrorMessages({
            gender: ['gender must be a string'],
        });
    });

	test('invalidation cases for is_active field', () => {
		expect({
			validator,
			data: {
				name: 'Some name',
				email: 'somemail@some.com',
				is_active: 'not a boolean',
			},
		}).containsErrorMessages({
			is_active: ['is_active must be a boolean value'],
		});

		expect({
			validator,
			data: {
				name: 'Some name',
				email: 'some@some.com',
				is_active: 5 as any,
			},
		}).containsErrorMessages({
			is_active: ['is_active must be a boolean value'],
		});
	});

	test('invalidation cases for created_at field', () => {
		expect({
			validator,
			data: {
				name: 'Some name',
				email: 'somemail@some.com',
				created_at: 5 as any,
			},
		}).containsErrorMessages({
			created_at: ['created_at must be a Date instance'],
		});
	});

	test('invalidation cases for updated_at field', () => {
		expect({
			validator,
			data: {
				name: 'Some name',
				email: 'somemail@some.com',
				updated_at: 5 as any,
			},
		}).containsErrorMessages({
			updated_at: ['updated_at must be a Date instance'],
		});
	});	

	describe('valid cases for all fields', () => {
		const arrange = [
			{
				name: 'a'.repeat(100),
				email: 'somemail@some.com',
				cellphone: '(11) 98985-6561',
				cpf: '99999999999',
				gender: 'Female',				
			},
			{
				name: 'Elvis',
				email: 'elvis@some.com',
				cellphone: '+55 (11) 98985-6561',
				cpf: '99999999999',
			},
			{
				name: 'Elvis Presley',
				email: 'elvis.presley@some.com',
				cellphone: '+55 (11) 98985-6561',
				cpf: '99999999999',
				is_active: false,
			},
			{
				name: 'John',
				email: 'john@some.com',
				cellphone: '1198985123',
				is_active: true,
				created_at: new Date(),
			},
			{
				name: 'John',
				email: 'john@some.com',
				is_active: true,
				birth_date: new Date('2000-01-01'),
				created_at: new Date(),
			},			
		];

		test.each(arrange)('validates %p', (item) => {
			const isValid = validator.validate(item);
			expect(isValid).toBe(true);
			expect(validator.errors).toBeNull();
			expect(validator.validatedData).toStrictEqual(new CustomerRules(item));
		});
	});
});

import UserValidatorFactory, {
	UserRules,
	UserValidator,
} from '../user.validator';

describe('User Validator Tests', () => {
	let validator: UserValidator;

	beforeEach(() => (validator = UserValidatorFactory.create()));

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
			name: [
				'name must be longer than or equal to 3 characters',
			],
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

	test('invalidation cases for group field', () => {
		expect({
			validator,
			data: {
				name: 'Some name',
				email: 'email@mail.com',
				group: '',
			},
		}).containsErrorMessages({
			group: ['group should not be empty'],
		});
	});

	test('invalidation cases for role field', () => {
		expect({
			validator,
			data: {
				name: 'Some name',
				email: 'email@mail.com',
				group: 'some-group',
				role: '',
			},
		}).containsErrorMessages({
			role: ['role should not be empty'],
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

	describe('valid cases for all fields', () => {
		const arrange = [
			{
				name: 'a'.repeat(100),
				email: 'somemail@some.com',
				password: 'Somepassword#',
				group: 'some-group',
				role: 'some-role',	
			},
			{
				name: 'Elvis',
				email: 'elvis@some.com',
				password: 'Somepassword#',
				group: 'some-group',
				role: 'some-role',	
			},
			{
				name: 'Elvis Presley',
				email: 'elvis.presley@some.com',
				password: 'Somepassword#',
				is_active: false,
				group: 'some-group',
				role: 'some-role',	
			},
			{
				name: 'John',
				email: 'john@some.com',
				password: 'Somepassword#',
				is_active: true,
				created_at: new Date(),
				group: 'some-group',
				role: 'some-role',	
			},
		];

		test.each(arrange)('validates %p', (item) => {
			const isValid = validator.validate(item);
			expect(isValid).toBe(true);
			expect(validator.errors).toBeNull();
			expect(validator.validatedData).toStrictEqual(new UserRules(item));
		});
	});
});

import RoleValidatorFactory, { RoleRules, RoleValidator } from '../role.validator';

describe('Role Validator Unit Tests', () => {
	let validator: RoleValidator;

	beforeEach(() => (validator = RoleValidatorFactory.create()));

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

	test('invalidation cases for description field', () => {
		expect({
			validator,
			data: { name: 'Some name', description: '' },
		}).containsErrorMessages({
			description: ['description should not be empty'],
		});
	});

	test('invalidation cases for is_active field', () => {
		expect({
			validator,
			data: {
				name: 'Some name',
				description: 'Some description',
				is_active: null,
			},
		}).containsErrorMessages({
			is_active: ['is_active must be a boolean'],
		});
	});

	test('invalidation cases for created_at field', () => {
		expect({
			validator,
			data: {
				name: 'Some name',
				description: 'Some description',
				created_at: 5 as any,
			},
		}).containsErrorMessages({
			created_at: ['created_at must be a Date instance'],
		});
	});

	describe('valid cases for all fields', () => {
		const arrange = [
			{
				name: 'Some name',
				description: 'Some description',
			},
			{
				name: 'Some name',
				description: 'Some description',
				is_active: false,
			},
			{
				name: 'Some name',
				description: 'Some description',
				is_active: true,
				created_at: new Date(),
			},
		];

		test.each(arrange)(
			'validates %p',
			(item) => {
				const isValid = validator.validate(item);
				expect(isValid).toBe(true);
				expect(validator.errors).toBeNull();
				expect(validator.validatedData).toStrictEqual(
					new RoleRules(item)
				);

			}
		);
	});
});

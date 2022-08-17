import PasswordValidatorFactory, {
	PasswordRules,
	PasswordValidator,
} from '../password.validator';

describe('Password Validator Tests', () => {
	let validator: PasswordValidator;

	beforeEach(() => {
		validator = PasswordValidatorFactory.create();
	});

	test('invalid cases for password field', () => {
		expect({ validator, data: null }).containsErrorMessages({
			password: [
				'Password too weak. Use at least one uppercase letter, one lowercase letter, one number or one special character',
				'password must be longer than or equal to 6 characters',
			],
		});

		expect({
			validator,
			data: { password: '' },
		}).containsErrorMessages({
			password: [
				'Password too weak. Use at least one uppercase letter, one lowercase letter, one number or one special character',
				'password must be shorter than or equal to 32 characters',
				'password must be longer than or equal to 6 characters',
				'password must be a string',
			],
		});

		expect({
			validator,
			data: { password: 'a'.repeat(5) },
		}).containsErrorMessages({
			password: [
				'Password too weak. Use at least one uppercase letter, one lowercase letter, one number or one special character',
				'password must be shorter than or equal to 32 characters',
				'password must be longer than or equal to 6 characters',
				'password must be a string',
			],
		});

		expect({
			validator,
			data: { password: 'a'.repeat(33) },
		}).containsErrorMessages({
			password: [
				'Password too weak. Use at least one uppercase letter, one lowercase letter, one number or one special character',
				'password must be shorter than or equal to 32 characters',
				'password must be longer than or equal to 6 characters',
				'password must be a string',
			],
		});
	});

	test('valid cases for password field', () => {
		const arrange = [
			'Somepassword1',
			'Somepassword1!',
			'Somepassword@',
			'Somepassword#',
		];

		arrange.forEach((password) => {
			const isValid = validator.validate(password);

			expect(isValid).toBe(true);
			expect(validator.errors).toBeNull();
			expect(validator.validatedData).toStrictEqual(
				new PasswordRules(password)
			);
		});
	});
});

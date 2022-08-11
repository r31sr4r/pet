import ClassValidatorFields from '../validators/class-validator-fields';
import { FieldsError } from '../validators/validator-fields-interface';
import { objectContaining } from 'expect';
import { EntityValidationError } from '../errors/validation-error';

type Expected =
	| { validator: ClassValidatorFields<any>; data: any }
	| (() => any);

expect.extend({
	containsErrorMessages(expected: Expected, received: FieldsError) {
		if (typeof expected === 'function') {
			try {
				expected();
				return isValid();
			} catch (e) {
				const error = e as EntityValidationError;
				return assertContainsErrorsMessages(error.error, received);
			}
		} else {
			const { validator, data } = expected;
			const validated = validator.validate(data);

			if (validated) {
				return isValid();
			}

			return assertContainsErrorsMessages(validator.errors, received);
		}
	},
});

function isValid() {
	return { pass: true, message: () => '' };
}

function assertContainsErrorsMessages(
	expected: FieldsError,
	received: FieldsError
) {
	const isMatch = objectContaining(received).asymmetricMatch(expected);

	return isMatch
		? { pass: true, message: () => '' }
		: {
				pass: false,
				message: () =>
					`The validation errors not contains ${JSON.stringify(
						received
					)}. Current: ${JSON.stringify(expected)}`,
		  };
}

import ValidationError from '../errors/validation-error';
import ValidatorRules from './validator-rules';

type Values = {
	value: any;
	property: string;
};

type ExpectedRule = {
	value: any;
	property: string;
	rule: keyof ValidatorRules;
	error: ValidationError;
	params?: any[];
};

function assertIsInvalid(expected: ExpectedRule) {
	expect(() => {
		runRule(expected);
	}).toThrow(expected.error);
}

function assertIsValid(expected: ExpectedRule) {
	expect(() => {
		runRule(expected);
	}).not.toThrow(expected.error);
}

function runRule({
	value,
	property,
	rule,
	params = [],
}: Omit<ExpectedRule, 'error'>) {
	const validator = ValidatorRules.values(value, property);
	const method: any = validator[rule];
	method.apply(validator, params);
}

describe('ValidatorRules Unit Tests', () => {
	test('values method', () => {
		const validator = ValidatorRules.values('some value', 'field');
		expect(validator).toBeInstanceOf(ValidatorRules);
		expect(validator['value']).toBe('some value');
		expect(validator['property']).toBe('field');
	});

	test('required validation rule', () => {
		let arrange: Values[] = [
			{ value: undefined, property: 'field' },
			{ value: null, property: 'field' },
			{ value: '', property: 'field' },
		];
		const error = new ValidationError('field is required');

		arrange.forEach((item) => {
			assertIsInvalid({
				value: item.value,
				property: item.property,
				rule: 'required',
				error,
			});
		});

		arrange = [
			{ value: 'some value', property: 'field' },
			{ value: 5, property: 'field' },
			{ value: 0, property: 'field' },
			{ value: true, property: 'field' },
		];

		arrange.forEach((item) => {
			assertIsValid({
				value: item.value,
				property: item.property,
				rule: 'required',
				error,
			});
		});
	});

	test('string validation rule', () => {
		let arrange: Values[] = [
			{ value: 5, property: 'field' },
			{ value: {}, property: 'field' },
			{ value: false, property: 'field' },
		];
		const error = new ValidationError('field must be a string');

		arrange.forEach((item) => {
			assertIsInvalid({
				value: item.value,
				property: item.property,
				rule: 'string',
				error,
			});
		});

		arrange = [
			{ value: 'some value', property: 'field' },
			{ value: null, property: 'field' },
			{ value: undefined, property: 'field' },
		];

		arrange.forEach((item) => {
			assertIsValid({
				value: item.value,
				property: item.property,
				rule: 'string',
				error,
			});
		});
	});

	test('maxlength validation rule', () => {
		let arrange: Values[] = [
			{
				value: 'some value with more than 10 characters',
				property: 'field',
			},
		];
		const error = new ValidationError(
			'field must be less or equal than 10 characters'
		);

		arrange.forEach((item) => {
			assertIsInvalid({
				value: item.value,
				property: item.property,
				rule: 'maxlength',
				error,
				params: [10],
			});
		});

		arrange = [
			{ value: 'some value', property: 'field' },
			{ value: null, property: 'field' },
			{ value: undefined, property: 'field' },
		];

		arrange.forEach((item) => {
			assertIsValid({
				value: item.value,
				property: item.property,
				rule: 'maxlength',
				error,
				params: [10],
			});
		});
	});

	test('boolean validation rule', () => {
		let arrange: Values[] = [
			{ value: 'some value', property: 'field' },
			{ value: 5, property: 'field' },
			{ value: 0, property: 'field' },
			{ value: {}, property: 'field' },
			{ value: 'true', property: 'field' },
		];
		const error = new ValidationError('field must be a boolean');

		arrange.forEach((item) => {
			assertIsInvalid({
				value: item.value,
				property: item.property,
				rule: 'boolean',
				error,
			});
		});

		arrange = [
			{ value: true, property: 'field' },
			{ value: false, property: 'field' },
			{ value: null, property: 'field' },
			{ value: undefined, property: 'field' },
		];

		arrange.forEach((item) => {
			assertIsValid({
				value: item.value,
				property: item.property,
				rule: 'boolean',
				error,
			});
		});
	});

	test('date validation rule', () => {
		let arrange: Values[] = [
			{ value: 'some value', property: 'field' },
			{ value: 5, property: 'field' },
			{ value: 0, property: 'field' },
			{ value: {}, property: 'field' },
			{ value: 'true', property: 'field' },
		];
		const error = new ValidationError('field must be a date');

		arrange.forEach((item) => {
			assertIsInvalid({
				value: item.value,
				property: item.property,
				rule: 'date',
				error,
			});
		});

		arrange = [
			{ value: new Date(), property: 'field' },
			{ value: new Date('2020-02-04'), property: 'field' },
			{ value: null, property: 'field' },
			{ value: undefined, property: 'field' },
		];

		arrange.forEach((item) => {
			assertIsValid({
				value: item.value,
				property: item.property,
				rule: 'date',
				error,
			});
		});

	});

	it('should throw a validation error when combine two or more validation rules', () => {
		let validator = ValidatorRules.values(null, 'field');
		expect(() => {
			validator.required().string().maxlength(5);
		}).toThrow(new ValidationError('field is required'));

		validator = ValidatorRules.values(5, 'field');
		expect(() => {
			validator.required().string().maxlength(5);
		}).toThrow(new ValidationError('field must be a string'));

		validator = ValidatorRules.values("123456", 'field');
        expect(() => {
			validator.required().string().maxlength(5);
		}).toThrow(new ValidationError('field must be less or equal than 5 characters'));

        validator = ValidatorRules.values(null, 'field');
		expect(() => {
			validator.required().boolean();
		}).toThrow(new ValidationError('field is required'));        

        validator = ValidatorRules.values("some value", 'field');
		expect(() => {
			validator.required().boolean();
		}).toThrow(new ValidationError('field must be a boolean'));      
		
		validator = ValidatorRules.values('2020-04-06', 'field');
		expect(() => {
			validator.required().date();
		}).toThrow(new ValidationError('field must be a date'));

	});

	it('should valid when combine two or more validation rules', () => {

        expect.assertions(0);

        ValidatorRules.values("some value", 'field').required().string();
        ValidatorRules.values(null, 'field').string().maxlength(10);
        ValidatorRules.values(undefined, 'field').string().maxlength(10);
        ValidatorRules.values("some value", 'field').required().string().maxlength(10);

        ValidatorRules.values(true, 'field').required().boolean();
        ValidatorRules.values(false, 'field').required().boolean();

		ValidatorRules.values(new Date(), 'field').required().date();
		ValidatorRules.values(new Date('2020-02-04'), 'field').required().date();

    });
});

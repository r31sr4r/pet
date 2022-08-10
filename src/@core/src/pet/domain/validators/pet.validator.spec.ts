import PetValidatorFactory, { PetRules, PetValidator } from './pet.validator';

describe('Pet Validator Tests', () => {
	let validator: PetValidator;

	beforeEach(() => (validator = PetValidatorFactory.create()));

	test('invalidation cases for name field', () => {
		expect({ validator, data: null }).containsErrorMessages({
			name: [
				'name should not be empty',
				'name must be a string',
				'name must be shorter than or equal to 100 characters',
			],
		});

		expect({
			validator,
			data: { name: '', type: 'Cat' },
		}).containsErrorMessages({
			name: ['name should not be empty'],
		});

		expect({
			validator,
			data: { name: 'a'.repeat(101), type: '' },
		}).containsErrorMessages({
			name: ['name must be shorter than or equal to 100 characters'],
		});

		expect({
			validator,
			data: { name: 5 as any, type: 'Cat' },
		}).containsErrorMessages({
			name: [
				'name must be a string',
				'name must be shorter than or equal to 100 characters',
			],
		});
	});

	test('invalidation cases for type field', () => {
		expect({
			validator,
			data: { name: 'Tom', type: '' },
		}).containsErrorMessages({
			type: ['type should not be empty'],
		});

        expect({    
            validator,
            data: { name: 'Tom', type: 5 as any },
        }).containsErrorMessages({
            type: ['type must be a string'],
        });
        
	});

    test('invalidation cases for breed field', () => {
        expect({
            validator,
            data: { name: 'Tom', type: 'Cat', breed: 5 as any },
        }).containsErrorMessages({
            breed: ['breed must be a string'],
        });
    }
    );
    
    test('invalidation cases for gender field', () => {
        expect({
            validator,
            data: { name: 'Tom', type: 'Cat', breed: 'Persian', gender: true },
        }).containsErrorMessages({
            gender: ['gender must be a string'],
        });
    });

    test('invalidation cases for birth_date field', () => {
        expect({
            validator,
            data: { name: 'Tom', type: 'Cat', birth_date: 5 as any },
        }).containsErrorMessages({
            birth_date: ['birth_date must be a Date instance'],
        });
    });    

    test('invalidation cases for is_active field', () => {
        expect({
            validator,
            data: { name: 'Tom', type: 'Cat', is_active: 'true' },
        }).containsErrorMessages({
            is_active: ['is_active must be a boolean value'],
        });

        expect({
            validator,
            data: { name: 'Tom', type: 'Cat', is_active: 5 as any },
        }).containsErrorMessages({
            is_active: ['is_active must be a boolean value'],
        });
    });

    test('invalidation cases for created_at field', () => {
        expect({
            validator,
            data: { name: 'Tom', type: 'Cat', created_at: 5 as any },
        }).containsErrorMessages({
            created_at: ['created_at must be a Date instance'],
        });
    });    


	describe('valid cases for fields', () => {
		const arrange = [
			{ name: 'a'.repeat(100), type: 'dog' },
			{ name: 'Elvis', type: 'cat' },
			{ name: 'Elvis', type: 'cat', breed: undefined },
			{ name: 'Elvis', type: 'cat', breed: 'Persian' },
			{ name: 'Elvis', type: 'cat', breed: 'Persian', is_active: false },
			{
				name: 'Elvis',
				type: 'cat',
				breed: 'Persian',
				is_active: false,
				birth_date: new Date('2020-04-01'),
			},
			{
				name: 'Elvira',
				type: 'cat',
				breed: 'Persian',
                gender: 'Female',
				is_active: false,
				birth_date: new Date('2020-04-01'),
			},            
		];

		test.each(arrange)(
			'validates %p',
			(item) => {
				const isValid = validator.validate(item);
				expect(isValid).toBe(true);
				expect(validator.errors).toBeNull();
				expect(validator.validatedData).toStrictEqual(
					new PetRules(item)
				);

			}
		);
	});
});

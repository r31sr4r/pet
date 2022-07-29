import PetValidatorFactory, { PetRules, PetValidator } from "./pet.validator";

describe('Pet Validator Tests', () => {
    let validator: PetValidator;

    beforeEach(() => (validator = PetValidatorFactory.create()));

    test('invalidation cases for name field', () => {
        //@ts-ignore
        expect({validator, data: null}).containsErrorMessages({
            name: [
                'name should not be empty',
                'name must be a string',
                'name must be shorter than or equal to 100 characters',
            ]
        })

        // let isValid = validator.validate(null);

        // expect(isValid).toBe(false);
		// expect(validator.errors['name']).toStrictEqual([
		// 	'name should not be empty',
		// 	'name must be a string',
		// 	'name must be shorter than or equal to 100 characters',
		// ]);

        // isValid = validator.validate({ name: '', type: '' });

        // expect(isValid).toBe(false);
        // expect(validator.errors['name']).toStrictEqual([
        //     'name should not be empty',
        // ]);

        // isValid = validator.validate({ name: 'a'.repeat(101), type: '' });
        
        // expect(isValid).toBe(false);
        // expect(validator.errors['name']).toStrictEqual([
        //     'name must be shorter than or equal to 100 characters',
        // ]);

        // isValid = validator.validate({ name: 5 as any, type: 'dog' });

        // expect(isValid).toBe(false);
        // expect(validator.errors['name']).toStrictEqual([
        //     'name must be a string',
        //     'name must be shorter than or equal to 100 characters',
        // ]);


    });

    test('valid cases for fields', () => {

        const arrange = [            
            { name: 'a'.repeat(100), type: 'dog' },
            { name: 'Elvis', type: 'cat' },
            { name: 'Elvis', type: 'cat', breed: undefined },
            { name: 'Elvis', type: 'cat', breed: 'Persian' },
            { name: 'Elvis', type: 'cat', breed: 'Persian', is_active: false },
            { name: 'Elvis', type: 'cat', breed: 'Persian', is_active: false, birth_date: new Date('2020-04-01') },            
        ]

        arrange.forEach(data => {
            const isValid = validator.validate(data);

            expect(isValid).toBe(true);
            expect(validator.errors).toBeNull();
            expect(validator.validatedData).toStrictEqual(new PetRules(data));
        
            
        });
    });

});
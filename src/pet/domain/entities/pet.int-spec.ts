import ValidationError from '../../../@seedwork/errors/validation-error';
import { Pet } from './pet';

describe('Pet Integration Tests', () => {
	describe('create method', () => {
		it('should throw an error when name is invalid', () => {
			expect(() => new Pet({ name: null, type: 'Dog' })).toThrow(
				new ValidationError('name is required')
			);

			expect(() => new Pet({ name: '', type: 'Dog' })).toThrow(
				new ValidationError('name is required')
			);

			expect(() => new Pet({ name: 5 as any, type: 'Dog' })).toThrow(
				new ValidationError('name must be a string')
			);

			expect(
				() => new Pet({ name: 't'.repeat(101), type: 'Dog' })
			).toThrow(
				new ValidationError(
					'name must be less or equal than 100 characters'
				)
			);
		});

		it('should throw an error when type is invalid', () => {
			expect(() => new Pet({ name: 'toto', type: null })).toThrow(
				new ValidationError('type is required')
			);

			expect(() => new Pet({ name: 'toto', type: '' })).toThrow(
				new ValidationError('type is required')
			);

			expect(() => new Pet({ name: 'toto', type: 5 as any })).toThrow(
				new ValidationError('type must be a string')
			);
		});

		it('should throw an error when breed is invalid', () => {
			expect(
				() => new Pet({ name: 'toto', type: 'Dog', breed: 5 as any })
			).toThrow(new ValidationError('breed must be a string'));
		});

		it('should throw an error when birth_date is invalid', () => {
			expect(
				() =>
					new Pet({
						name: 'toto',
						type: 'Dog',
						birth_date: '2021-04-03' as any,
					})
			).toThrow(new ValidationError('birth_date must be a date'));
		});

		it('should throw an error when is_active is invalid', () => {
			expect(
				() =>
					new Pet({ name: 'toto', type: 'Dog', is_active: 5 as any })
			).toThrow(new ValidationError('is_active must be a boolean'));
		});

		it('shoul create a pet', () => {
			expect.assertions(0);
			new Pet({ name: 'toto', type: 'Dog' }); //NOSONAR
			new Pet({ name: 'toto', type: 'Dog', breed: 'Labrador Retriever' }); //NOSONAR
			/* NOSONAR */ new Pet({
				name: 'toto',
				type: 'Dog',
				breed: 'Pittbull',
				birth_date: new Date('2020-04-03'),
				is_active: false,
			});
		});
	});

	describe('update method', () => {
		it('should throw an error when name is invalid', () => {
			const pet = new Pet({ name: 'toto', type: 'Dog' });

			expect(() => pet.update(null, 'Dog')).toThrow(
				new ValidationError('name is required')
			);

			expect(() => pet.update('', 'Dog')).toThrow(
				new ValidationError('name is required')
			);

			expect(() => pet.update(5 as any, 'Dog')).toThrow(
				new ValidationError('name must be a string')
			);

			expect(() => pet.update('t'.repeat(101), 'Dog')).toThrow(
				new ValidationError(
					'name must be less or equal than 100 characters'
				)
			);
		});

		it('should throw an error when type is invalid', () => {
			const pet = new Pet({ name: 'toto', type: 'Dog' });

			expect(() => pet.update('toto', null)).toThrow(
				new ValidationError('type is required')
			);

			expect(() => pet.update('toto', '')).toThrow(
				new ValidationError('type is required')
			);

			expect(() => pet.update('toto', 5 as any)).toThrow(
				new ValidationError('type must be a string')
			);
		});

		it('should throw an error when breed is invalid', () => {
			const pet = new Pet({ name: 'toto', type: 'Dog' });

			expect(() => pet.update('toto', 'Dog', 5 as any)).toThrow(
				new ValidationError('breed must be a string')
			);
		});

		it('should throw an error when birth_date is invalid', () => {
			const pet = new Pet({ name: 'toto', type: 'Dog' });

			expect(() =>
				pet.update('toto', 'Dog', 'Boxer', '2021-04-02' as any)
			).toThrow(new ValidationError('birth_date must be a date'));
		});

		it('should update the pet', () => {
			expect.assertions(0);
			const pet = new Pet({ name: 'toto', type: 'Dog' });

			pet.update('titi', 'Cat');
			pet.update('titi', 'Cat', 'Persian');
			pet.update('titi', 'Cat', 'Persian', new Date('2021-04-02'));
		});
	});
});

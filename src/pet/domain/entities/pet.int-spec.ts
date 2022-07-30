import { EntityValidationError } from '../../../@seedwork/domain/errors/validation-error';
import { Pet } from './pet';

describe('Pet Integration Tests', () => {
	describe('create method', () => {
		it('should throw an error when name is invalid', () => {
			expect(
				() => new Pet({ name: null, type: 'Dog' })
			).containsErrorMessages({
				name: [
					'name should not be empty',
					'name must be a string',
					'name must be shorter than or equal to 100 characters',
				],
			});

			expect(
				() => new Pet({ name: '', type: 'Dog' })
			).containsErrorMessages({
				name: ['name should not be empty'],
			});

			expect(
				() => new Pet({ name: 5 as any, type: 'Dog' })
			).containsErrorMessages({
				name: [
					'name must be a string',
					'name must be shorter than or equal to 100 characters',
				],
			});

			expect(
				() => new Pet({ name: 't'.repeat(101), type: 'Dog' })
			).containsErrorMessages({
				name: ['name must be shorter than or equal to 100 characters'],
			});
		});

		it('should throw an error when type is invalid', () => {
			expect(
				() => new Pet({ name: 'toto', type: null })
			).containsErrorMessages({
				type: ['type should not be empty', 'type must be a string'],
			});

			expect(
				() => new Pet({ name: 'toto', type: '' })
			).containsErrorMessages({
				type: ['type should not be empty'],
			});

			expect(
				() => new Pet({ name: 'toto', type: 5 as any })
			).containsErrorMessages({
				type: ['type must be a string'],
			});
		});

		it('should throw an error when breed is invalid', () => {
			expect(
				() => new Pet({ name: 'toto', type: 'Dog', breed: 5 as any })
			).containsErrorMessages({
				breed: ['breed must be a string'],
			});
		});

		it('should throw an error when gender is invalid', () => {
			expect(
				() => new Pet({ name: 'toto', type: 'Dog', gender: 5 as any })
			).containsErrorMessages({
				gender: ['gender must be a string'],
			});
		});

		it('should throw an error when birth_date is invalid', () => {
			expect(
				() =>
					new Pet({
						name: 'toto',
						type: 'Dog',
						birth_date: '2021-04-03' as any,
					})
			).containsErrorMessages({
				birth_date: ['birth_date must be a Date instance'],
			});
		});

		it('should throw an error when is_active is invalid', () => {
			expect(
				() =>
					new Pet({ name: 'toto', type: 'Dog', is_active: 5 as any })
			).containsErrorMessages({
				is_active: ['is_active must be a boolean value'],
			});
		});

		it('shoul create a pet', () => {
			expect.assertions(0);
			new Pet({ name: 'toto', type: 'Dog' }); //NOSONAR
			new Pet({ name: 'toto', type: 'Dog', breed: 'Labrador Retriever' }); //NOSONAR
			/* NOSONAR */ new Pet({
				name: 'toto',
				type: 'Dog',
				breed: 'Labrador Retriever',
				gender: 'Male',
			});
			/* NOSONAR */ new Pet({
				name: 'toto',
				type: 'Dog',
				breed: 'Pittbull',
				birth_date: new Date('2020-04-03'),
				is_active: false,
			});
			/* NOSONAR */ new Pet({
				name: 'toto',
				type: 'Dog',
				breed: 'Pittbull',
				gender: 'Male',
				birth_date: new Date('2020-04-03'),
			});
		});
	});

	describe('update method', () => {
		it('should throw an error when name is invalid', () => {
			const pet = new Pet({ name: 'toto', type: 'Dog' });

			expect(() => pet.update(null, 'Dog')).containsErrorMessages({
				name: [
					'name should not be empty',
					'name must be a string',
					'name must be shorter than or equal to 100 characters',
				],
			});

			expect(() => pet.update('', 'Dog')).containsErrorMessages({
				name: ['name should not be empty'],
			});

			expect(() => pet.update(5 as any, 'Dog')).containsErrorMessages({
				name: [
					'name must be a string',
					'name must be shorter than or equal to 100 characters',
				],
			});

			expect(() =>
				pet.update('t'.repeat(101), 'Dog')
			).containsErrorMessages({
				name: ['name must be shorter than or equal to 100 characters'],
			});
		});

		it('should throw an error when type is invalid', () => {
			const pet = new Pet({ name: 'toto', type: 'Dog' });

			expect(() => pet.update('toto', null)).containsErrorMessages({
				type: ['type should not be empty', 'type must be a string'],
			});

			expect(() => pet.update('toto', '')).containsErrorMessages({
				type: ['type should not be empty'],
			});

			expect(() => pet.update('toto', 5 as any)).containsErrorMessages({
				type: ['type must be a string'],
			});
		});

		it('should throw an error when breed is invalid', () => {
			const pet = new Pet({ name: 'toto', type: 'Dog' });

			expect(() =>
				pet.update('toto', 'Dog', 5 as any)
			).containsErrorMessages({
				breed: ['breed must be a string'],
			});
		});

		it('should throw an error when gender is invalid', () => {
			const pet = new Pet({ name: 'toto', type: 'Dog' });

			expect(() =>
				pet.update('toto', 'Dog', 'Boxer', 5 as any)
			).containsErrorMessages({
				"gender":["gender must be a string"]
			});
		});

		it('should throw an error when birth_date is invalid', () => {
			const pet = new Pet({ name: 'toto', type: 'Dog' });

			expect(() =>
				pet.update(
					'toto',
					'Dog',
					'Boxer',
					pet.gender,
					'2021-04-02' as any
				)
			).containsErrorMessages({
				birth_date: ['birth_date must be a Date instance'],
			});
		});

		it('should update the pet', () => {
			expect.assertions(0);
			const pet = new Pet({ name: 'toto', type: 'Dog' });

			pet.update('titi', 'Cat');
			pet.update('titi', 'Cat', 'Persian');
			pet.update('titi', 'Cat', 'Persian', 'Female');
			pet.update('titi', 'Cat', 'Persian', pet.gender, new Date('2021-04-02'));
		});
	});
});

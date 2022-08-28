import { Pet } from './pet';

describe('Pet Integration Tests', () => {
	describe('create method', () => {
		it('should throw an error when name is invalid', () => {
			expect(
				() =>
					new Pet({
						name: null,
						type: 'Dog',
						customer_id: 'c127f89c-71e8-4379-9d9e-aaf7f54ad922',
					})
			).containsErrorMessages({
				name: [
					'name should not be empty',
					'name must be a string',
					'name must be shorter than or equal to 100 characters',
				],
			});

			expect(
				() =>
					new Pet({
						name: '',
						type: 'Dog',
						customer_id: 'c127f89c-71e8-4379-9d9e-aaf7f54ad922',
					})
			).containsErrorMessages({
				name: ['name should not be empty'],
			});

			expect(
				() =>
					new Pet({
						name: 5 as any,
						type: 'Dog',
						customer_id: 'c127f89c-71e8-4379-9d9e-aaf7f54ad922',
					})
			).containsErrorMessages({
				name: [
					'name must be a string',
					'name must be shorter than or equal to 100 characters',
				],
			});

			expect(
				() =>
					new Pet({
						name: 't'.repeat(101),
						type: 'Dog',
						customer_id: 'c127f89c-71e8-4379-9d9e-aaf7f54ad922',
					})
			).containsErrorMessages({
				name: ['name must be shorter than or equal to 100 characters'],
			});
		});

		it('should throw an error when type is invalid', () => {
			expect(
				() =>
					new Pet({
						name: 'toto',
						type: null,
						customer_id: 'c127f89c-71e8-4379-9d9e-aaf7f54ad922',
					})
			).containsErrorMessages({
				type: ['type should not be empty', 'type must be a string'],
			});

			expect(
				() =>
					new Pet({
						name: 'toto',
						type: '',
						customer_id: 'c127f89c-71e8-4379-9d9e-aaf7f54ad922',
					})
			).containsErrorMessages({
				type: ['type should not be empty'],
			});

			expect(
				() =>
					new Pet({
						name: 'toto',
						type: 5 as any,
						customer_id: 'c127f89c-71e8-4379-9d9e-aaf7f54ad922',
					})
			).containsErrorMessages({
				type: ['type must be a string'],
			});
		});

		it('should throw an error when breed is invalid', () => {
			expect(
				() =>
					new Pet({
						name: 'toto',
						type: 'Dog',
						breed: 5 as any,
						customer_id: 'c127f89c-71e8-4379-9d9e-aaf7f54ad922',
					})
			).containsErrorMessages({
				breed: ['breed must be a string'],
			});
		});

		it('should throw an error when gender is invalid', () => {
			expect(
				() =>
					new Pet({
						name: 'toto',
						type: 'Dog',
						gender: 5 as any,
						customer_id: 'c127f89c-71e8-4379-9d9e-aaf7f54ad922',
					})
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
						customer_id: 'c127f89c-71e8-4379-9d9e-aaf7f54ad922',
					})
			).containsErrorMessages({
				birth_date: ['birth_date must be a Date instance'],
			});
		});

		it('should throw an error when is_active is invalid', () => {
			expect(
				() =>
					new Pet({
						name: 'toto',
						type: 'Dog',
						is_active: 5 as any,
						customer_id: 'c127f89c-71e8-4379-9d9e-aaf7f54ad922',
					})
			).containsErrorMessages({
				is_active: ['is_active must be a boolean value'],
			});
		});

		it('should throw an error when customer_id is invalid', () => {
			expect(
				() =>
					new Pet({
						name: 'toto',
						type: 'Dog',
						customer_id: 5 as any,
					})
			).containsErrorMessages({
				customer_id: ['customer_id must be a UUID'],
			});
		});

		it('shoul create a pet', () => {
			expect.assertions(0);
			/* NOSONAR */ new Pet({
				name: 'toto',
				type: 'Dog',
				customer_id: 'bfbed856-b904-4e03-8dfb-f213c154f29d',
			});
			/* NOSONAR */ new Pet({
				name: 'toto',
				type: 'Dog',
				breed: 'Labrador Retriever',
				customer_id: '14626520-4894-4e5f-a4b8-bc7072b98beb',
			});
			/* NOSONAR */ new Pet({
				name: 'toto',
				type: 'Dog',
				breed: 'Labrador Retriever',
				gender: 'Male',
				customer_id: '14626520-4894-4e5f-a4b8-bc7072b98beb',
			});
			/* NOSONAR */ new Pet({
				name: 'toto',
				type: 'Dog',
				breed: 'Pittbull',
				birth_date: new Date('2020-04-03'),
				is_active: false,
				customer_id: '14626520-4894-4e5f-a4b8-bc7072b98beb',
			});
			/* NOSONAR */ new Pet({
				name: 'toto',
				type: 'Dog',
				breed: 'Pittbull',
				gender: 'Male',
				birth_date: new Date('2020-04-03'),
				customer_id: '14626520-4894-4e5f-a4b8-bc7072b98beb',
			});
		});
	});

	describe('update method', () => {
		it('should throw an error when name is invalid', () => {
			const pet = new Pet({
				name: 'toto',
				type: 'Dog',
				customer_id: '21149677-34f2-4a6b-9574-834ad544361f',
			});

			expect(() =>
				pet.update(null, 'Dog', '21149677-34f2-4a6b-9574-834ad544361f')
			).containsErrorMessages({
				name: [
					'name should not be empty',
					'name must be a string',
					'name must be shorter than or equal to 100 characters',
				],
			});

			expect(() =>
				pet.update('', 'Dog', '21149677-34f2-4a6b-9574-834ad544361f')
			).containsErrorMessages({
				name: ['name should not be empty'],
			});

			expect(() =>
				pet.update(
					5 as any,
					'Dog',
					'21149677-34f2-4a6b-9574-834ad544361f'
				)
			).containsErrorMessages({
				name: [
					'name must be a string',
					'name must be shorter than or equal to 100 characters',
				],
			});

			expect(() =>
				pet.update(
					't'.repeat(101),
					'Dog',
					'21149677-34f2-4a6b-9574-834ad544361f'
				)
			).containsErrorMessages({
				name: ['name must be shorter than or equal to 100 characters'],
			});
		});

		it('should throw an error when type is invalid', () => {
			const pet = new Pet({
				name: 'toto',
				type: 'Dog',
				customer_id: '66c9bcec-a534-4300-b9da-dc81e3df5894',
			});

			expect(() =>
				pet.update('toto', null, '21149677-34f2-4a6b-9574-834ad544361f')
			).containsErrorMessages({
				type: ['type should not be empty', 'type must be a string'],
			});

			expect(() =>
				pet.update('toto', '', '21149677-34f2-4a6b-9574-834ad544361f')
			).containsErrorMessages({
				type: ['type should not be empty'],
			});

			expect(() =>
				pet.update(
					'toto',
					5 as any,
					'21149677-34f2-4a6b-9574-834ad544361f'
				)
			).containsErrorMessages({
				type: ['type must be a string'],
			});
		});

		it('should throw an error when breed is invalid', () => {
			const pet = new Pet({
				name: 'toto',
				type: 'Dog',
				customer_id: '21149677-34f2-4a6b-9574-834ad544361f',
			});

			expect(() =>
				pet.update(
					'toto',
					'Dog',
					'21149677-34f2-4a6b-9574-834ad544361f',
					5 as any
				)
			).containsErrorMessages({
				breed: ['breed must be a string'],
			});
		});

		it('should throw an error when gender is invalid', () => {
			const pet = new Pet({
				name: 'toto',
				type: 'Dog',
				customer_id: '21149677-34f2-4a6b-9574-834ad544361f',
			});

			expect(() =>
				pet.update(
					'toto',
					'Dog',
					'21149677-34f2-4a6b-9574-834ad544361f',
					'Boxer',
					5 as any
				)
			).containsErrorMessages({
				gender: ['gender must be a string'],
			});
		});

		it('should throw an error when birth_date is invalid', () => {
			const pet = new Pet({
				name: 'toto',
				type: 'Dog',
				customer_id: '21149677-34f2-4a6b-9574-834ad544361f',
			});

			expect(() =>
				pet.update(
					'toto',
					'Dog',
					'21149677-34f2-4a6b-9574-834ad544361f',
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
			const pet = new Pet({
				name: 'toto',
				type: 'Dog',
				customer_id: '21149677-34f2-4a6b-9574-834ad544361f',
			});

			pet.update('titi', 'Cat', pet.customer_id);
			pet.update('titi', 'Cat', pet.customer_id, 'Persian');
			pet.update('titi', 'Cat', pet.customer_id, 'Persian', 'Female');
			pet.update(
				'titi',
				'Cat',
				pet.customer_id,
				'Persian',
				pet.gender,
				new Date('2021-04-02')
			);
		});
	});
});

import { Pet, PetProperties } from './pet';
import { omit } from 'lodash';
import UniqueEntityId from '#seedwork/domain/value-objects/unique-entity-id.vo';

describe('Pet Unit Tests', () => {
	beforeEach(() => {
		Pet.validate = jest.fn();
	});

	test('constructor of Pet', () => {
		let pet = new Pet({
			name: 'Tom',
			type: 'Cat',
			customer_id: 'd57f733f-f808-45c0-914b-fe37cbc3953b',
		});
		let props = omit(pet.props, ['created_at', 'birth_date']);
		expect(Pet.validate).toHaveBeenCalled();
		expect(props).toStrictEqual({
			name: 'Tom',
			type: 'Cat',
			breed: null,
			gender: null,
			is_active: true,
			customer_id: 'd57f733f-f808-45c0-914b-fe37cbc3953b',
		});

		pet = new Pet({
			name: 'Tom',
			type: 'Cat',
			breed: 'Persian',
			gender: 'Male',
			customer_id: 'bdcc80e1-b80d-43d2-bdfc-bee42b9255aa',
		});
		props = omit(pet.props, ['created_at']);
		expect(props).toStrictEqual({
			name: 'Tom',
			type: 'Cat',
			breed: 'Persian',
			gender: 'Male',
			birth_date: null,
			is_active: true,
			customer_id: 'bdcc80e1-b80d-43d2-bdfc-bee42b9255aa',
		});

		let created_at = new Date();
		pet = new Pet({
			name: 'Tom',
			type: 'Cat',
			breed: 'Persian',
			created_at,
			customer_id: 'bdcc80e1-b80d-43d2-bdfc-bee42b9255aa',
		});
		expect(pet.props).toStrictEqual({
			name: 'Tom',
			type: 'Cat',
			breed: 'Persian',
			gender: null,
			birth_date: null,
			is_active: true,
			created_at,
			customer_id: 'bdcc80e1-b80d-43d2-bdfc-bee42b9255aa',
		});

		let birth_date = new Date('2020-01-01');
		created_at = new Date();
		pet = new Pet({
			name: 'Tom',
			type: 'Cat',
			is_active: false,
			birth_date,
			created_at,
			customer_id: 'bdcc80e1-b80d-43d2-bdfc-bee42b9255aa',
		});
		expect(pet.props).toStrictEqual({
			name: 'Tom',
			type: 'Cat',
			breed: null,
			gender: null,
			birth_date,
			is_active: false,
			created_at,
			customer_id: 'bdcc80e1-b80d-43d2-bdfc-bee42b9255aa',
		});

		pet = new Pet({
			name: 'Maul',
			type: 'Dog',
			customer_id: 'd7c3aaa0-79a3-46dc-b3da-fce7d4449fb5',
		});
		expect(pet.props).toMatchObject({
			name: 'Maul',
			type: 'Dog',
			customer_id: 'd7c3aaa0-79a3-46dc-b3da-fce7d4449fb5',
		});

		created_at = new Date();
		pet = new Pet({
			name: 'Maul',
			type: 'Dog',
			created_at,
			customer_id: 'd7c3aaa0-79a3-46dc-b3da-fce7d4449fb5',
		});
		expect(pet.props).toMatchObject({
			name: 'Maul',
			type: 'Dog',
			created_at,
			customer_id: 'd7c3aaa0-79a3-46dc-b3da-fce7d4449fb5',
		});
	});

	test('id field', () => {
		type PetData = { props: PetProperties; id?: UniqueEntityId };
		const data: PetData[] = [
			{
				props: {
					name: 'Tom',
					type: 'Cat',
					customer_id: 'b36eda4c-3e0b-4f05-8e35-fa96c73ef5d8',
				},
			},
			{
				props: {
					name: 'Maul',
					type: 'Dog',
					customer_id: 'b36eda4c-3e0b-4f05-8e35-fa96c73ef5d8',
				},
				id: null,
			},
			{
				props: {
					name: 'Maul',
					type: 'Dog',
					customer_id: 'b36eda4c-3e0b-4f05-8e35-fa96c73ef5d8',
				},
				id: undefined,
			},
			{
				props: {
					name: 'Maul',
					type: 'Dog',
					customer_id: 'b36eda4c-3e0b-4f05-8e35-fa96c73ef5d8',
				},
				id: new UniqueEntityId(),
			},
		];

		data.forEach((item) => {
			const pet = new Pet(item.props, item.id);
			expect(pet.id).not.toBeNull();
		});
	});

	test('getter and setter of name prop', () => {
		let pet = new Pet({
			name: 'Tom',
			type: 'Cat',
			customer_id: 'b36eda4c-3e0b-4f05-8e35-fa96c73ef5d8',
		});
		expect(pet.name).toBe('Tom');

		pet['name'] = 'Maul';
		expect(pet.name).toBe('Maul');
	});

	test('getter and setter of type prop', () => {
		let pet = new Pet({
			name: 'Tom',
			type: 'Cat',
			customer_id: 'b36eda4c-3e0b-4f05-8e35-fa96c73ef5d8',
		});
		expect(pet.type).toBe('Cat');

		pet['type'] = 'Dog';
		expect(pet.type).toBe('Dog');
	});

	test('getter and setter of breed prop', () => {
		let pet = new Pet({
			name: 'Tom',
			type: 'Cat',
			customer_id: 'b36eda4c-3e0b-4f05-8e35-fa96c73ef5d8',
		});
		expect(pet.breed).toBe(null);

		pet = new Pet({
			name: 'Tom',
			type: 'Cat',
			breed: 'Persian',
			customer_id: 'b36eda4c-3e0b-4f05-8e35-fa96c73ef5d8',
		});
		expect(pet.breed).toBe('Persian');

		pet = new Pet({
			name: 'Tom',
			type: 'Cat',
			customer_id: 'b36eda4c-3e0b-4f05-8e35-fa96c73ef5d8',
		});
		pet['breed'] = 'Persian';
		expect(pet.breed).toBe('Persian');
		pet['breed'] = undefined;
		expect(pet.breed).toBeNull();
		expect(pet.breed).toBeNull();
	});

	test('getter and setter of gender prop', () => {
		let pet = new Pet({
			name: 'Tom',
			type: 'Cat',
			customer_id: 'b36eda4c-3e0b-4f05-8e35-fa96c73ef5d8',
		});
		expect(pet.gender).toBe(null);

		pet = new Pet({
			name: 'Tom',
			type: 'Cat',
			gender: 'Male',
			customer_id: 'b36eda4c-3e0b-4f05-8e35-fa96c73ef5d8',
		});
		expect(pet.gender).toBe('Male');

		pet = new Pet({
			name: 'Tom',
			type: 'Cat',
			customer_id: 'b36eda4c-3e0b-4f05-8e35-fa96c73ef5d8',
		});
		pet['gender'] = 'Male';
		expect(pet.gender).toBe('Male');

		pet['gender'] = undefined;
		expect(pet.gender).toBeNull();
	});

	test('getter and setter of birth_date prop', () => {
		let pet = new Pet({
			name: 'Tom',
			type: 'Cat',
			customer_id: 'b36eda4c-3e0b-4f05-8e35-fa96c73ef5d8',
		});
		expect(pet.birth_date).toBe(null);

		let birth_date = new Date('2020-01-01');
		pet = new Pet({
			name: 'Tom',
			type: 'Cat',
			birth_date,
			customer_id: 'b36eda4c-3e0b-4f05-8e35-fa96c73ef5d8',
		});
		expect(pet.birth_date).toBe(birth_date);

		birth_date = new Date('2021-03-01');
		pet = new Pet({
			name: 'Tom',
			type: 'Cat',
			customer_id: 'b36eda4c-3e0b-4f05-8e35-fa96c73ef5d8',
		});
		pet['birth_date'] = birth_date;
		expect(pet.birth_date).toBe(birth_date);
		pet['birth_date'] = undefined;
		expect(pet.birth_date).toBeNull();
		pet['birth_date'] = null;
		expect(pet.birth_date).toBeNull();
	});

	test('getter and setter of is_active prop', () => {
		let pet = new Pet({
			name: 'Tom',
			type: 'Cat',
			customer_id: 'b36eda4c-3e0b-4f05-8e35-fa96c73ef5d8',
		});
		expect(pet.is_active).toBeTruthy();

		pet = new Pet({
			name: 'Tom',
			type: 'Cat',
			is_active: false,
			customer_id: 'b36eda4c-3e0b-4f05-8e35-fa96c73ef5d8',
		});
		expect(pet.is_active).toBeFalsy();

		pet = new Pet({
			name: 'Tom',
			type: 'Cat',
			customer_id: 'b36eda4c-3e0b-4f05-8e35-fa96c73ef5d8',
		});
		pet['is_active'] = false;
		expect(pet.is_active).toBeFalsy();
		pet['is_active'] = undefined;
		expect(pet.is_active).toBeTruthy();
		pet['is_active'] = null;
		expect(pet.is_active).toBeTruthy();
	});

	test('getter and setter of created_at prop', () => {
		let pet = new Pet({
			name: 'Tom',
			type: 'Cat',
			customer_id: 'b36eda4c-3e0b-4f05-8e35-fa96c73ef5d8',
		});
		expect(pet.created_at).toBeInstanceOf(Date);

		pet = new Pet({
			name: 'Tom',
			type: 'Cat',
			created_at: new Date(),
			customer_id: 'b36eda4c-3e0b-4f05-8e35-fa96c73ef5d8',
		});
		expect(pet.created_at).toBeInstanceOf(Date);
	});

	it('should deactivate a pet', () => {
		let pet = new Pet({
			name: 'Tom',
			type: 'Cat',
			customer_id: 'b36eda4c-3e0b-4f05-8e35-fa96c73ef5d8',
		});
		expect(pet.is_active).toBeTruthy();
		pet.deactivate();
		expect(pet.is_active).toBeFalsy();
		expect(pet).toMatchObject({
			name: 'Tom',
			type: 'Cat',
			is_active: false,
		});
	});

	it('should activate a pet', () => {
		let pet = new Pet({
			name: 'Tom',
			type: 'Cat',
			is_active: false,
			customer_id: 'b36eda4c-3e0b-4f05-8e35-fa96c73ef5d8',
		});
		expect(pet.is_active).toBeFalsy();
		pet.activate();
		expect(pet.is_active).toBeTruthy();
		expect(pet).toMatchObject({
			name: 'Tom',
			type: 'Cat',
			is_active: true,
		});
	});

	it('should update a pet', () => {
		let pet = new Pet({
			name: 'Tom',
			type: 'Cat',
			customer_id: 'b36eda4c-3e0b-4f05-8e35-fa96c73ef5d8',
		});
		expect(pet.is_active).toBeTruthy();
		pet.update(
			'Maul',
			'Dog',
			'b36eda4c-3e0b-4f05-8e35-fa96c73ef5d8',
			'Boxer',
			'Male',
			pet.birth_date
		);
		expect(Pet.validate).toHaveBeenCalledTimes(2);
		expect(pet).toMatchObject({
			name: 'Maul',
			type: 'Dog',
			gender: 'Male',
			is_active: true,
		});
	});

	it('should update a pet with new birth_date', () => {
		let pet = new Pet({
			name: 'Tom',
			type: 'Cat',
			customer_id: 'b36eda4c-3e0b-4f05-8e35-fa96c73ef5d8',
		});
		expect(pet.is_active).toBeTruthy();
		let birth_date = new Date('2020-01-01');
		pet.update(
			'Maul',
			'Dog',
			'b36eda4c-3e0b-4f05-8e35-fa96c73ef5d8',
			'Boxer',
			pet.gender,
			birth_date
		);
		expect(Pet.validate).toHaveBeenCalledTimes(2);
		expect(pet).toMatchObject({
			name: 'Maul',
			type: 'Dog',
			is_active: true,
			birth_date,
		});
		expect(pet.birth_date).toBe(birth_date);
	});
});

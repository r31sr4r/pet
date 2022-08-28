import { Pet } from '#pet/domain/entities/pet';
import PetInMemoryRepository from './pet-in-memory.repository';

describe('PetInMemoryRepository Unit Tests', () => {
	let repository: PetInMemoryRepository;

	beforeEach(() => {
		repository = new PetInMemoryRepository();
	});

	it('should return items without filter', async () => {
		const items = [
			new Pet({
				name: 'Dog',
				type: 'dog',
				breed: 'labrador',
				customer_id: 'b36eda4c-3e0b-4f05-8e35-fa96c73ef5d8',
			}),
			new Pet({
				name: 'Cat',
				type: 'cat',
				breed: 'persian',
				customer_id: 'b36eda4c-3e0b-4f05-8e35-fa96c73ef5d8',
			}),
			new Pet({
				name: 'Bird',
				type: 'bird',
				breed: 'parrot',
				customer_id: 'b36eda4c-3e0b-4f05-8e35-fa96c73ef5d8',
			}),
		];

		const spyFilterMethod = jest.spyOn(items, 'filter' as any);

		const filterdItems = await repository['applyFilter'](items, null);

		expect(filterdItems).toStrictEqual(items);
		expect(spyFilterMethod).not.toHaveBeenCalled();
	});

	it('should return items with filter', async () => {
		const items = [
			new Pet({
				name: 'Dog',
				type: 'dog',
				breed: 'labrador',
				customer_id: 'b36eda4c-3e0b-4f05-8e35-fa96c73ef5d8',
			}),
			new Pet({
				name: 'Cat',
				type: 'cat',
				breed: 'persian',
				customer_id: 'b36eda4c-3e0b-4f05-8e35-fa96c73ef5d8',
			}),
			new Pet({
				name: 'Bird',
				type: 'bird',
				breed: 'parrot',
				customer_id: 'b36eda4c-3e0b-4f05-8e35-fa96c73ef5d8',
			}),
		];

		const spyFilterMethod = jest.spyOn(items, 'filter' as any);

		const filterdItems = await repository['applyFilter'](items, 'dog');

		expect(filterdItems).toStrictEqual([items[0]]);
		expect(spyFilterMethod).toHaveBeenCalled();
	});

	it('should return items sorted by asc name when sort is null', async () => {
		const items = [
			new Pet({
				name: 'Toto',
				type: 'dog',
				breed: 'labrador',
				customer_id: 'b36eda4c-3e0b-4f05-8e35-fa96c73ef5d8',
			}),
			new Pet({
				name: 'Tom',
				type: 'cat',
				breed: 'persian',
				customer_id: 'b36eda4c-3e0b-4f05-8e35-fa96c73ef5d8',
			}),
			new Pet({
				name: 'Little Bird',
				type: 'bird',
				breed: 'parrot',
				customer_id: 'b36eda4c-3e0b-4f05-8e35-fa96c73ef5d8',
			}),
		];

		const sortedItems = await repository['applySort'](items, null, null);

		expect(sortedItems).toStrictEqual([items[2], items[1], items[0]]);
	});

	it('should return items sorted by type', async () => {
		const items = [
			new Pet({
				name: 'Toto',
				type: 'dog',
				breed: 'labrador',
				customer_id: 'b36eda4c-3e0b-4f05-8e35-fa96c73ef5d8',
			}),
			new Pet({
				name: 'Little Bird',
				type: 'bird',
				breed: 'parrot',
				customer_id: 'b36eda4c-3e0b-4f05-8e35-fa96c73ef5d8',
			}),
			new Pet({
				name: 'Tom',
				type: 'cat',
				breed: 'persian',
				customer_id: 'b36eda4c-3e0b-4f05-8e35-fa96c73ef5d8',
			}),
		];

		let sortedItems = await repository['applySort'](items, 'type', 'asc');
		expect(sortedItems).toStrictEqual([items[1], items[2], items[0]]);

		sortedItems = await repository['applySort'](items, 'type', 'desc');
		expect(sortedItems).toStrictEqual([items[0], items[2], items[1]]);
	});

	it('should return items sorted by breed', async () => {
		const items = [
			new Pet({
				name: 'Toto',
				type: 'dog',
				breed: 'labrador',
				customer_id: 'b36eda4c-3e0b-4f05-8e35-fa96c73ef5d8',
			}),
			new Pet({
				name: 'Tom',
				type: 'cat',
				breed: 'persian',
				customer_id: 'b36eda4c-3e0b-4f05-8e35-fa96c73ef5d8',
			}),
			new Pet({
				name: 'Little Bird',
				type: 'bird',
				breed: 'parrot',
				customer_id: 'b36eda4c-3e0b-4f05-8e35-fa96c73ef5d8',
			}),
		];

		let sortedItems = await repository['applySort'](items, 'breed', 'asc');
		expect(sortedItems).toStrictEqual([items[0], items[2], items[1]]);

		sortedItems = await repository['applySort'](items, 'breed', 'desc');
		expect(sortedItems).toStrictEqual([items[1], items[2], items[0]]);
	});
});

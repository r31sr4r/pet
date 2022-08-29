import { Customer } from '#customer/domain/entities/customer';
import CustomerInMemoryRepository from './customer-in-memory.repository';

describe('CustomerInMemoryRepository Unit Tests', () => {
	let repository: CustomerInMemoryRepository;

	beforeEach(() => {
		repository = new CustomerInMemoryRepository();
	});

	it('should return items without filter', async () => {
		const items = [
			new Customer({
				name: 'Michael Corleone',
				email: 'michalc@mail.com',
			}),
			new Customer({
				name: 'Don Vito Corleone',
				email: 'doncorleone@mail.com',
				cellphone: '+55 (11) 99999-9999',
			}),
			new Customer({
				name: 'Sonny Corleone',
				email: 'sonny@mail.com',
				cellphone: '+55 (11) 99999-9999',
			}),
		];

		const spyFilterMethod = jest.spyOn(items, 'filter' as any);

		const filterdItems = await repository['applyFilter'](items, null);

		expect(filterdItems).toStrictEqual(items);
		expect(spyFilterMethod).not.toHaveBeenCalled();
	});

	it('should return items with filter', async () => {
		const items = [
			new Customer({
				name: 'Michael Corleone',
				email: 'michalc@mail.com',
			}),
			new Customer({
				name: 'Don Vito Corleone',
				email: 'doncorleone@mail.com',
				cellphone: '+55 (11) 99999-9999',
			}),
			new Customer({
				name: 'Sonny Corleone',
				email: 'sonny@mail.com',
				cellphone: '+55 (11) 99999-9999',
			}),
		];

		const spyFilterMethod = jest.spyOn(items, 'filter' as any);

		const filterdItems = await repository['applyFilter'](items, 'michael');

		expect(filterdItems).toStrictEqual([items[0]]);
		expect(spyFilterMethod).toHaveBeenCalled();
	});

	it('should return items sorted by asc name when sort is null', async () => {
		const items = [
			new Customer({
				name: 'Michael Corleone',
				email: 'michalc@mail.com',
			}),
			new Customer({
				name: 'Don Vito Corleone',
				email: 'doncorleone@mail.com',
				cellphone: '+55 (11) 99999-9999',
			}),
			new Customer({
				name: 'Sonny Corleone',
				email: 'sonny@mail.com',
				cellphone: '+55 (11) 99999-9999',
			}),
		];

		const sortedItems = await repository['applySort'](items, null, null);

		expect(sortedItems).toStrictEqual([items[1], items[0], items[2]]);
	});

	it('should return items sorted by email', async () => {
		const items = [
			new Customer({
				name: 'Michael Corleone',
				email: 'michalc@mail.com',
			}),
			new Customer({
				name: 'Don Vito Corleone',
				email: 'doncorleone@mail.com',
				cellphone: '+55 (11) 99999-9999',
			}),
			new Customer({
				name: 'Sonny Corleone',
				email: 'sonny@mail.com',
				cellphone: '+55 (11) 99999-9999',
			}),
		];

		let sortedItems = await repository['applySort'](items, 'email', 'asc');
		expect(sortedItems).toStrictEqual([items[1], items[0], items[2]]);

		sortedItems = await repository['applySort'](items, 'email', 'desc');
		expect(sortedItems).toStrictEqual([items[2], items[0], items[1]]);
	});

	it('should return items sorted by birth_date', async () => {
		const items = [
			new Customer({
				name: 'Michael Corleone',
				email: 'michalc@mail.com',
                birth_date: new Date(1990, 1, 1),
			}),
			new Customer({
				name: 'Sonny Corleone',
				email: 'sonny@mail.com',
				cellphone: '+55 (11) 99999-9999',
                birth_date: new Date(1980, 1, 1),
			}),
			new Customer({
				name: 'Don Vito Corleone',
				email: 'doncorleone@mail.com',
				cellphone: '+55 (11) 99999-9999',
                birth_date: new Date(1970, 1, 1),
			}),            
		];

		let sortedItems = await repository['applySort'](items, 'birth_date', 'asc');
		expect(sortedItems).toStrictEqual([items[2], items[1], items[0]]);

		sortedItems = await repository['applySort'](items, 'breed', 'desc');
		expect(sortedItems).toStrictEqual([items[0], items[1], items[2]]);
	});
});

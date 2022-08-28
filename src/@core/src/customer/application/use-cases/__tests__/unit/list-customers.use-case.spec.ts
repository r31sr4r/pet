import { ListCustomersUseCase } from '../../list-customers.use-case';
import CustomerInMemoryRepository from '../../../../infra/db/in-memory/customer-in-memory.repository';
import { CustomerRepository } from '../../../../domain/repository/customer.repository';
import { Customer } from '../../../../domain/entities/customer';

let repository: CustomerInMemoryRepository;
let useCase: ListCustomersUseCase.UseCase;

beforeEach(() => {
	repository = new CustomerInMemoryRepository();
	useCase = new ListCustomersUseCase.UseCase(repository);
});

describe('ListCustomersUseCase Unit Tests', () => {
	test('toOutput method', () => {
		let result = new CustomerRepository.SearchResult({
			items: [],
			total: 1,
			current_page: 1,
			per_page: 2,
			sort: null,
			sort_dir: null,
			filter: null,
		});

		let output = useCase['toOutput'](result);
		expect(output).toStrictEqual({
			items: [],
			total: 1,
			current_page: 1,
			last_page: 1,
			per_page: 2,
		});

		const entity = new Customer({ name: 'Toto', type: 'dog' });
		result = new CustomerRepository.SearchResult({
			items: [entity],
			total: 1,
			current_page: 1,
			per_page: 2,
			sort: null,
			sort_dir: null,
			filter: null,
		});

		output = useCase['toOutput'](result);
		expect(output).toStrictEqual({
			items: [entity.toJSON()],
			total: 1,
			current_page: 1,
			last_page: 1,
			per_page: 2,
		});
	});

	it('should return output with two customers ordered by name when input is empty', async () => {
		const created_at = new Date();
		const entity1 = new Customer({
			name: 'Toto',
            type: 'dog',
			created_at,
		});
		const entity2 = new Customer({
			name: 'Garfield',
            type: 'cat',
			created_at: new Date(created_at.getTime() + 100),
		});

		repository.items = [entity1, entity2];

		const output = await useCase.execute({});

		expect(output).toStrictEqual({
			items: [entity2.toJSON(), entity1.toJSON()],
			total: 2,
			current_page: 1,
			last_page: 1,
			per_page: 15,
		});
	});

	it('should return output with three customers ordered by name when input is empty', async () => {
		const items = [
			new Customer({ name: 'Toto', type: 'dog' }),
			new Customer({
				name: 'Garfield',
                type: 'cat',
				created_at: new Date(new Date().getTime() + 100),
			}),
			new Customer({
				name: 'Auren',
                type: 'cat',
				created_at: new Date(new Date().getTime() + 200),
			}),
		];
		repository.items = items;

		const output = await useCase.execute({});
		expect(output).toStrictEqual({
			items: [...items].reverse().map((i) => i.toJSON()),
			total: 3,
			current_page: 1,
			last_page: 1,
			per_page: 15,
		});
	});

	it('should return output using paginate, sort and filter', async () => {
		const items = [
			new Customer({ name: 'a', type: 'dog' }),
			new Customer({ name: 'AAA', type: 'bird' }),
			new Customer({ name: 'AaA',  type: 'cat' }),
			new Customer({ name: 'b', type: 'fish' }),
			new Customer({ name: 'c', type: 'cat' }),
		];
		repository.items = items;

		let output = await useCase.execute({
			page: 1,
			per_page: 2,
			sort: 'name',
			filter: 'a',
		});
		expect(output).toStrictEqual({
			items: [items[1].toJSON(), items[2].toJSON()],
			total: 3,
			current_page: 1,
			last_page: 2,
			per_page: 2,
		});

		output = await useCase.execute({
			page: 2,
			per_page: 2,
			sort: 'name',
			filter: 'a',
		});
		expect(output).toStrictEqual({
			items: [items[0].toJSON()],
			total: 3,
			current_page: 2,
			last_page: 2,
			per_page: 2,
		});

		output = await useCase.execute({
			page: 1,
			per_page: 2,
			sort: 'name',
			sort_dir: 'desc',
			filter: 'a',
		});
		expect(output).toStrictEqual({
			items: [items[0].toJSON(), items[2].toJSON()],
			total: 3,
			current_page: 1,
			last_page: 2,
			per_page: 2,
		});
	});
});

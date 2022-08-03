import { ListPetsUseCase } from '../list-pets.use-case';
import PetInMemoryRepository from '../../../infra/repository/pet-in-memory.repository';
import { PetRepository } from '../../../domain/repository/pet.repository';
import { Pet } from '../../../domain/entities/pet';

let repository: PetInMemoryRepository;
let useCase: ListPetsUseCase.UseCase;

beforeEach(() => {
	repository = new PetInMemoryRepository();
	useCase = new ListPetsUseCase.UseCase(repository);
});

describe('ListPetsUseCase Unit Tests', () => {
	test('toOutput method', () => {
		let result = new PetRepository.SearchResult({
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

		const entity = new Pet({ name: 'Toto', type: 'dog' });
		result = new PetRepository.SearchResult({
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

	it('should return output with two pets ordered by name when input is empty', async () => {
		const created_at = new Date();
		const entity1 = new Pet({
			name: 'Toto',
            type: 'dog',
			created_at,
		});
		const entity2 = new Pet({
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

	it('should return output with three pets ordered by name when input is empty', async () => {
		const items = [
			new Pet({ name: 'Toto', type: 'dog' }),
			new Pet({
				name: 'Garfield',
                type: 'cat',
				created_at: new Date(new Date().getTime() + 100),
			}),
			new Pet({
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
			new Pet({ name: 'a', type: 'dog' }),
			new Pet({ name: 'AAA', type: 'bird' }),
			new Pet({ name: 'AaA',  type: 'cat' }),
			new Pet({ name: 'b', type: 'fish' }),
			new Pet({ name: 'c', type: 'cat' }),
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

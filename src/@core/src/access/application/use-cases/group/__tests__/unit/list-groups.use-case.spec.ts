import { ListGroupsUseCase } from '../../list-groups.use-case';
import GroupInMemoryRepository from '../../../../../infra/db/in-memory/group-in-memory.repository';
import { GroupRepository } from '../../../../../domain/repository/group.repository';
import { Group } from '../../../../../domain/entities/group';

let repository: GroupInMemoryRepository;
let useCase: ListGroupsUseCase.UseCase;

beforeEach(() => {
	repository = new GroupInMemoryRepository();
	useCase = new ListGroupsUseCase.UseCase(repository);
});

describe('ListGroupsUseCase Unit Tests', () => {
	test('toOutput method', () => {
		let result = new GroupRepository.SearchResult({
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

		const entity = new Group({
			name: 'Vet',
			description: 'Vet Description',
		});
		result = new GroupRepository.SearchResult({
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

	it('should return output with two groups ordered by created_at when input is empty', async () => {
		const created_at = new Date();
		const entity1 = new Group({
			name: 'group1',
			description: 'group1 description',
			created_at,
		});
		const entity2 = new Group({
			name: 'group2',
			description: 'group2 description',
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

	it('should return output with three groups ordered by created_at when input is empty', async () => {
		const items = [
			new Group({ name: 'teste 1', description: 'teste 1 description' }),
			new Group({
				name: 'teste 2',
				description: 'teste 2 description',
				created_at: new Date(new Date().getTime() + 100),
			}),
			new Group({
				name: 'teste 3',
				description: 'teste 3 description',
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
			new Group({ name: 'aaa', description: 'aaa description' }),
			new Group({ name: 'AAA', description: 'AAA description' }),
			new Group({ name: 'AaA', description: 'AaA description' }),
			new Group({ name: 'bbb', description: 'bbb description' }),
			new Group({ name: 'ccc', description: 'ccc description' }),
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

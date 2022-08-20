import { ListRolesUseCase } from '../../list-roles.use-case';
import RoleInMemoryRepository from '../../../../../infra/db/in-memory/role-in-memory.repository';
import { RoleRepository } from '../../../../../domain/repository/role.repository';
import { Role } from '../../../../../domain/entities/role';

let repository: RoleInMemoryRepository;
let useCase: ListRolesUseCase.UseCase;

beforeEach(() => {
	repository = new RoleInMemoryRepository();
	useCase = new ListRolesUseCase.UseCase(repository);
});

describe('ListRolesUseCase Unit Tests', () => {
	test('toOutput method', () => {
		let result = new RoleRepository.SearchResult({
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

		const entity = new Role({
			name: 'Vet',
			description: 'Vet Description',
		});
		result = new RoleRepository.SearchResult({
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

	it('should return output with two roles ordered by created_at when input is empty', async () => {
		const created_at = new Date();
		const entity1 = new Role({
			name: 'role1',
			description: 'role1 description',
			created_at,
		});
		const entity2 = new Role({
			name: 'role2',
			description: 'role2 description',
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

	it('should return output with three roles ordered by created_at when input is empty', async () => {
		const items = [
			new Role({ name: 'teste 1', description: 'teste 1 description' }),
			new Role({
				name: 'teste 2',
				description: 'teste 2 description',
				created_at: new Date(new Date().getTime() + 100),
			}),
			new Role({
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
			new Role({ name: 'aaa', description: 'aaa description' }),
			new Role({ name: 'AAA', description: 'AAA description' }),
			new Role({ name: 'AaA', description: 'AaA description' }),
			new Role({ name: 'bbb', description: 'bbb description' }),
			new Role({ name: 'ccc', description: 'ccc description' }),
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

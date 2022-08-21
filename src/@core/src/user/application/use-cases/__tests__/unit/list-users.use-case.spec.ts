import { ListUsersUseCase } from '../../list-users.use-case';
import UserInMemoryRepository from '../../../../infra/db/in-memory/user-in-memory.repository';
import { UserRepository } from '../../../../domain/repository/user.repository';
import { User } from '../../../../domain/entities/user';

let repository: UserInMemoryRepository;
let useCase: ListUsersUseCase.UseCase;

beforeEach(() => {
	repository = new UserInMemoryRepository();
	useCase = new ListUsersUseCase.UseCase(repository);
});

describe('ListUsersUseCase Unit Tests', () => {
	test('toOutput method', () => {
		let result = new UserRepository.SearchResult({
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

		const entity = new User({
			name: 'Tony Stark',
			email: 'somemail@mail.com',
			password: 'Some123456',
		});
		result = new UserRepository.SearchResult({
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

	it('should return output with two users ordered by name when input is empty', async () => {
		const created_at = new Date();
		const entity1 = new User({
			name: 'Tony Stark',
			email: 'ton@mail.com',
			password: 'Some123456',
			created_at: new Date(created_at.getTime() + 100),
		});
		const entity2 = new User({
			name: 'Steve Rogers',
			email: 'steve.rogers@mail.com',
			password: 'Some123456',
			created_at,
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

	it('should return output with three users ordered by name when input is empty', async () => {
		const items = [
			new User({
				name: 'Tony Stark',
				email: 'ton@mail.com',
				password: 'Some123456',
			}),
			new User({
				name: 'Steve Rogers',
				email: 'steve.rogers@mail.com',
				password: 'Some123456',
				created_at: new Date(new Date().getTime() + 100),
			}),
			new User({
				name: 'Bruce Banner',
				email: 'banner321@mail.com',
				password: 'Some123456',
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
			new User({ name: 'aaa', email: 'aaa@gmail.com', password: 'Some123456' }),
			new User({ name: 'AAA', email: 'AAA@gmail.com', password: 'Some123456' }),
			new User({ name: 'AaA', email: 'AaA@gmail.com', password: 'Some123456' }),
			new User({ name: 'bbb', email: 'bbb@gmail.com', password: 'Some123456' }),
			new User({ name: 'ccc', email: 'ccc@gmail.com', password: 'Some123456' }),
		];
		repository.items = items;

		let output = await useCase.execute({
			page: 1,
			per_page: 2,
			sort: 'name',
			filter: 'aaa',
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
			filter: 'aaa',
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
			filter: 'aaa',
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

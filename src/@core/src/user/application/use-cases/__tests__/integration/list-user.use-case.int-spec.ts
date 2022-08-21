import { ListUsersUseCase } from '../../list-users.use-case';
import { setupSequelize } from '#seedwork/infra';
import { UserSequelize } from '#user/infra/db/sequelize/user-sequelize';
import _chance from 'chance';

const chance = _chance();

const { UserSequelizeRepository, UserModel, UserModelMapper } =
	UserSequelize;

describe('ListUsersUseCase Integration Tests', () => {
	let repository: UserSequelize.UserSequelizeRepository;
	let useCase: ListUsersUseCase.UseCase;

	setupSequelize({ models: [UserModel] });

	beforeEach(() => {
		repository = new UserSequelizeRepository(UserModel);
		useCase = new ListUsersUseCase.UseCase(repository);
	});

	it('should return output with 15 users ordered by name when input is empty', async () => {
		const models = await UserModel.factory()
			.count(15)
			.bulkCreate((index: number) => {
				return {
					id: chance.guid({ version: 4 }),
					name: `name ${('0000' + (15 - index)).slice(-4)} `,
					email: chance.email(),
					password: 'SomePassword123',
					is_active: true,
					created_at: new Date(new Date().getTime() + index),
				};
			});

		const output = await useCase.execute({});

		expect(output).toMatchObject({
			items: [...models]
				.reverse()
				.map(UserModelMapper.toEntity)
				.map((i) => i.toJSON()),
			total: 15,
			current_page: 1,
			last_page: 1,
			per_page: 15,
		});
	});

	it('should return output using paginate, sort and filter', async () => {
		const models = UserModel.factory().count(5).bulkMake();

		models[0].name = 'aaa';
		models[1].name = 'AAA';
		models[2].name = 'AaA';
		models[3].name = 'bbb';
		models[4].name = 'ccc';

		UserModel.bulkCreate(models.map((i) => i.toJSON()));

		let output = await useCase.execute({
			page: 1,
			per_page: 2,
			sort: 'name',
			filter: 'a',
		});

		expect(output).toMatchObject({
			items: [models[1], models[2]]
				.map(UserModelMapper.toEntity)
				.map((i) => i.toJSON()),
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
		expect(output).toMatchObject({
			items: [models[0]]
				.map(UserModelMapper.toEntity)
				.map((i) => i.toJSON()),
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
		expect(output).toMatchObject({
			items: [models[0], models[2]]
				.map(UserModelMapper.toEntity)
				.map((i) => i.toJSON()),
			total: 3,
			current_page: 1,
			last_page: 2,
			per_page: 2,
		});
	});
});

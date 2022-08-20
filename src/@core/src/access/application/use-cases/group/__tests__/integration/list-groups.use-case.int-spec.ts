import { ListGroupsUseCase } from '../../list-groups.use-case';
import { setupSequelize } from '#seedwork/infra';
import { GroupSequelize } from '#access/infra/db/sequelize/group-sequelize';
import _chance from 'chance';

const chance = _chance();

const { GroupSequelizeRepository, GroupModel, GroupModelMapper } =
	GroupSequelize;

describe('ListGroupsUseCase Integration Tests', () => {
	let repository: GroupSequelize.GroupSequelizeRepository;
	let useCase: ListGroupsUseCase.UseCase;

	setupSequelize({ models: [GroupModel] });

	beforeEach(() => {
		repository = new GroupSequelizeRepository(GroupModel);
		useCase = new ListGroupsUseCase.UseCase(repository);
	});

	it('should return output with four groups ordered by created_at when input is empty', async () => {
		const models = await GroupModel.factory()
			.count(4)
			.bulkCreate((index: number) => {
				return {
					id: chance.guid({ version: 4 }),
					name: `name ${index}`,
					description: 'some description',
					is_active: true,
					created_at: new Date(new Date().getTime() + index),
				};
			});

		const output = await useCase.execute({});

		expect(output).toMatchObject({
			items: [...models]
				.reverse()
				.map(GroupModelMapper.toEntity)
				.map((i) => i.toJSON()),
			total: 4,
			current_page: 1,
			last_page: 1,
			per_page: 15,
		});
	});

	it('should return output using paginate, sort and filter', async () => {
		const models = GroupModel.factory().count(5).bulkMake();

		models[0].name = 'aaa';
		models[1].name = 'AAA';
		models[2].name = 'AaA';
		models[3].name = 'bbb';
		models[4].name = 'ccc';

		GroupModel.bulkCreate(models.map((i) => i.toJSON()));

		let output = await useCase.execute({
			page: 1,
			per_page: 2,
			sort: 'name',
			filter: 'a',
		});

		expect(output).toMatchObject({
			items: [models[1], models[2]]
				.map(GroupModelMapper.toEntity)
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
				.map(GroupModelMapper.toEntity)
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
				.map(GroupModelMapper.toEntity)
				.map((i) => i.toJSON()),
			total: 3,
			current_page: 1,
			last_page: 2,
			per_page: 2,
		});
	});
});

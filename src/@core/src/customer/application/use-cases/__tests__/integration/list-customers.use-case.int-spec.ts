import { ListCustomersUseCase } from '../../list-customers.use-case';
import { setupSequelize } from '#seedwork/infra';
import { CustomerSequelize } from '#customer/infra/db/sequelize/customer-sequelize';
import _chance from 'chance';

const chance = _chance();

const { CustomerSequelizeRepository, CustomerModel, CustomerModelMapper } =
	CustomerSequelize;

describe('ListCustomersUseCase Integration Tests', () => {
	let repository: CustomerSequelize.CustomerSequelizeRepository;
	let useCase: ListCustomersUseCase.UseCase;

	setupSequelize({ models: [CustomerModel] });

	beforeEach(() => {
		repository = new CustomerSequelizeRepository(CustomerModel);
		useCase = new ListCustomersUseCase.UseCase(repository);
	});

	it('should return output with 15 customers ordered by name when input is empty', async () => {
		const models = await CustomerModel.factory()
			.count(15)
			.bulkCreate((index: number) => {
				return {
					id: chance.guid({ version: 4 }),
					name: `name ${('0000' + (15 - index)).slice(-4)} `,
					type: 'dog',
					breed: 'breed',
					gender: 'female',
					birth_date: null,
					is_active: true,
					created_at: new Date(new Date().getTime() + index),
				};
			});

		const output = await useCase.execute({});

		expect(output).toMatchObject({
			items: [...models]
				.reverse()
				.map(CustomerModelMapper.toEntity)
				.map((i) => i.toJSON()),
			total: 15,
			current_page: 1,
			last_page: 1,
			per_page: 15,
		});
	});

	it('should return output using paginate, sort and filter', async () => {
		const models = CustomerModel.factory().count(5).bulkMake();

		models[0].name = 'a';
		models[1].name = 'AAA';
		models[2].name = 'AaA';
		models[3].name = 'b';
		models[4].name = 'c';

		CustomerModel.bulkCreate(models.map((i) => i.toJSON()));

		let output = await useCase.execute({
			page: 1,
			per_page: 2,
			sort: 'name',
			filter: 'a',
		});

		expect(output).toMatchObject({
			items: [models[1], models[2]]
				.map(CustomerModelMapper.toEntity)
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
				.map(CustomerModelMapper.toEntity)
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
				.map(CustomerModelMapper.toEntity)
				.map((i) => i.toJSON()),
			total: 3,
			current_page: 1,
			last_page: 2,
			per_page: 2,
		});
	});
});

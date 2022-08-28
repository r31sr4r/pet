import { ListPetsUseCase } from '../../list-pets.use-case';
import { setupSequelize } from '#seedwork/infra';
import { PetSequelize } from '#pet/infra/db/sequelize/pet-sequelize';
import _chance from 'chance';
import { CustomerSequelize } from '#customer/infra';

const chance = _chance();

const { PetSequelizeRepository, PetModel, PetModelMapper } =
	PetSequelize;

describe('ListPetsUseCase Integration Tests', () => {
	let repository: PetSequelize.PetSequelizeRepository;
	let useCase: ListPetsUseCase.UseCase;

	setupSequelize({ models: [PetModel, CustomerSequelize.CustomerModel] });

	beforeEach(() => {
		repository = new PetSequelizeRepository(PetModel);
		useCase = new ListPetsUseCase.UseCase(repository);
	});

	it('should return output with 15 pets ordered by name when input is empty', async () => {
		const customer = await CustomerSequelize.CustomerModel.factory().create();
		const models = await (await PetModel.factory())
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
					customer_id: customer.id,
					created_at: new Date(new Date().getTime() + index),
				};
			});

		const output = await useCase.execute({});

		expect(output).toMatchObject({
			items: [...models]
				.reverse()
				.map(PetModelMapper.toEntity)
				.map((i) => i.toJSON()),
			total: 15,
			current_page: 1,
			last_page: 1,
			per_page: 15,
		});
	});

	it('should return output using paginate, sort and filter', async () => {		
		const models = (await PetModel.factory()).count(5).bulkMake();

		models[0].name = 'a';
		models[1].name = 'AAA';
		models[2].name = 'AaA';
		models[3].name = 'b';
		models[4].name = 'c';

		PetModel.bulkCreate(models.map((i) => i.toJSON()));

		let output = await useCase.execute({
			page: 1,
			per_page: 2,
			sort: 'name',
			filter: 'a',
		});

		expect(output).toMatchObject({
			items: [models[1], models[2]]
				.map(PetModelMapper.toEntity)
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
				.map(PetModelMapper.toEntity)
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
				.map(PetModelMapper.toEntity)
				.map((i) => i.toJSON()),
			total: 3,
			current_page: 1,
			last_page: 2,
			per_page: 2,
		});
	});
});

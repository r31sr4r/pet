import { CustomerSequelize } from '#customer/infra';
import { Pet, PetRepository } from '#pet/domain';
import { NotFoundError, UniqueEntityId } from '#seedwork/domain';
import { setupSequelize } from '#seedwork/infra/testing/helpers/db';
import _chance from 'chance';
import { PetSequelize } from '../pet-sequelize';

const { PetModel, PetSequelizeRepository, PetModelMapper } = PetSequelize;

describe('PetRepository Unit Tests', () => {
	setupSequelize({ models: [PetModel, CustomerSequelize.CustomerModel] });
	let chance: Chance.Chance;
	let repository: PetSequelize.PetSequelizeRepository;

	beforeAll(() => {
		chance = _chance();
	});

	beforeEach(async () => {
		repository = new PetSequelizeRepository(PetModel);
	});

	it('should insert a pet', async () => {
		const customer =
			await CustomerSequelize.CustomerModel.factory().create();
		let pet = new Pet({
			name: 'Pet 1',
			type: 'dog',
			customer_id: customer.id,
		});
		await repository.insert(pet);
		let model = await PetModel.findByPk(pet.id);
		expect(model.toJSON()).toStrictEqual(pet.toJSON());

		pet = new Pet({
			name: 'Pet 2',
			type: 'cat',
			is_active: false,
			customer_id: customer.id,
		});

		await repository.insert(pet);
		model = await PetModel.findByPk(pet.id);
		expect(model.toJSON()).toStrictEqual(pet.toJSON());

		pet = new Pet({
			name: 'Pet 3',
			type: 'dog',
			breed: 'labrador',
			gender: 'Male',
			birth_date: new Date('2021-04-06'),
			customer_id: customer.id,
		});

		await repository.insert(pet);
		model = await PetModel.findByPk(pet.id);
		expect(model.toJSON()).toStrictEqual(pet.toJSON());
	});

	it('should throw an error when entity has not been found', async () => {
		await expect(repository.findById('fake id')).rejects.toThrow(
			new NotFoundError('Entity not found using ID fake id')
		);
		await expect(
			repository.findById('312cffad-1938-489e-a706-643dc9a3cfd3')
		).rejects.toThrow(
			new NotFoundError(
				'Entity not found using ID 312cffad-1938-489e-a706-643dc9a3cfd3'
			)
		);
	});

	it('should find an entity by Id', async () => {
		const customer =
			await CustomerSequelize.CustomerModel.factory().create();
		const entity = new Pet({
			name: 'some name',
			type: 'dog',
			customer_id: customer.id,
		});
		await repository.insert(entity);

		let entityFound = await repository.findById(entity.id);
		expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());

		entityFound = await repository.findById(entity.uniqueEntityId);
		expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());
	});

	it('should find all entities', async () => {
		const customer = await CustomerSequelize.CustomerModel.factory().create();
		const entity1 = new Pet({ name: 'Toto', type: 'dog', customer_id: customer.id });
		const entity2 = new Pet({ name: 'Garfield', type: 'cat', customer_id: customer.id });
		const entity3 = new Pet({ name: 'some name', type: 'dog', customer_id: customer.id });
		await repository.insert(entity1);
		await repository.insert(entity2);
		await repository.insert(entity3);

		const entities = await repository.findAll();
		expect(entities.length).toBe(3);
		expect(entities[0].toJSON()).toStrictEqual(entity1.toJSON());
		expect(entities[1].toJSON()).toStrictEqual(entity2.toJSON());
		expect(entities[2].toJSON()).toStrictEqual(entity3.toJSON());
	});

	describe('search method tests', () => {
		it('should apply only paginate when other params are not provided', async () => {
			const customer = await CustomerSequelize.CustomerModel.factory().create();
			const factory = await PetModel.factory();
			await factory
				.count(16)
				.bulkCreate(() => ({
					id: chance.guid({ version: 4 }),
					name: chance.word(),
					type: chance.animal({ type: 'pet' }),
					breed: null,
					gender: null,
					birth_date: null,
					is_active: chance.bool(),
					created_at: chance.date(),
					customer_id: customer.id,
				}));

			const spyToEntity = jest.spyOn(PetModelMapper, 'toEntity');

			const searchOutput = await repository.search(
				new PetRepository.SearchParams()
			);

			expect(searchOutput).toBeInstanceOf(PetRepository.SearchResult);
			expect(spyToEntity).toHaveBeenCalledTimes(15);

			expect(searchOutput.toJSON()).toMatchObject({
				total: 16,
				current_page: 1,
				last_page: 2,
				per_page: 15,
				sort: null,
				sort_dir: null,
				filter: null,
			});

			searchOutput.items.forEach((item) => {
				expect(item).toBeInstanceOf(Pet);
				expect(item.id).toBeDefined();
			});
		});

		it('should order by name ASC when search params are not provided', async () => {
			const customer = await CustomerSequelize.CustomerModel.factory().create();			
			await (await PetModel.factory())
				.count(16)
				.bulkCreate((index) => ({
					id: chance.guid({ version: 4 }),
					name: `name ${('0000' + (16 - index)).slice(-4)} `,
					type: chance.animal({ type: 'pet' }),
					breed: null,
					gender: null,
					birth_date: null,
					is_active: chance.bool(),
					created_at: chance.date(),
					customer_id: customer.id,
				}));

			const searchOutput = await repository.search(
				new PetRepository.SearchParams()
			);

			searchOutput.items.forEach((item, index) => {
				expect(item.name).toBe(
					`name ${('0000' + (index + 1)).slice(-4)} `
				);
			});
		});

		it('should apply paginate and filter', async () => {
			const customer = await CustomerSequelize.CustomerModel.factory().create();
			const defaultProps = {
				type: 'dog',
				breed: null,
				gender: null,
				birth_date: null,
				is_active: true,
				created_at: new Date(),
				customer_id: customer.id,
			};

			const petsProp = [
				{
					id: chance.guid({ version: 4 }),
					name: 'test',
					...defaultProps,
				},
				{ id: chance.guid({ version: 4 }), name: 'a', ...defaultProps },
				{
					id: chance.guid({ version: 4 }),
					name: 'TEST',
					...defaultProps,
				},
				{
					id: chance.guid({ version: 4 }),
					name: 'TeSt',
					...defaultProps,
				},
			];
			const pets = await PetModel.bulkCreate(petsProp);

			let searchOutput = await repository.search(
				new PetRepository.SearchParams({
					page: 1,
					per_page: 2,
					filter: 'TEST',
				})
			);

			expect(searchOutput.toJSON(true)).toMatchObject(
				new PetRepository.SearchResult({
					items: [
						PetModelMapper.toEntity(pets[2]),
						PetModelMapper.toEntity(pets[3]),
					],
					total: 3,
					current_page: 1,
					per_page: 2,
					sort: null,
					sort_dir: null,
					filter: 'TEST',
				}).toJSON(true)
			);

			searchOutput = await repository.search(
				new PetRepository.SearchParams({
					page: 2,
					per_page: 2,
					filter: 'TEST',
				})
			);
			expect(searchOutput.toJSON(true)).toMatchObject(
				new PetRepository.SearchResult({
					items: [PetModelMapper.toEntity(pets[0])],
					total: 3,
					current_page: 2,
					per_page: 2,
					sort: null,
					sort_dir: null,
					filter: 'TEST',
				}).toJSON(true)
			);
		});

		it('should apply paginate and sort', async () => {
			const customer = await CustomerSequelize.CustomerModel.factory().create();
			expect(repository.sortableFields).toStrictEqual([
				'name',
				'type',
				'breed',
			]);
			const defaultProps = {
				breed: null,
				gender: null,
				birth_date: null,
				is_active: true,
				created_at: new Date(),
				customer_id: customer.id,
			};

			const petsProp = [
				{
					id: chance.guid({ version: 4 }),
					name: 'b',
					type: 'dog',
					...defaultProps,
				},
				{
					id: chance.guid({ version: 4 }),
					name: 'a',
					type: 'cat',
					...defaultProps,
				},
				{
					id: chance.guid({ version: 4 }),
					name: 'd',
					type: 'dog',
					...defaultProps,
				},
				{
					id: chance.guid({ version: 4 }),
					name: 'e',
					type: 'cat',
					...defaultProps,
				},
				{
					id: chance.guid({ version: 4 }),
					name: 'c',
					type: 'dog',
					...defaultProps,
				},
			];
			const pets = await PetModel.bulkCreate(petsProp);

			const arrange = [
				{
					params: new PetRepository.SearchParams({
						page: 1,
						per_page: 2,
						sort: 'name',
					}),
					result: new PetRepository.SearchResult({
						items: [
							PetModelMapper.toEntity(pets[1]),
							PetModelMapper.toEntity(pets[0]),
						],
						total: 5,
						current_page: 1,
						per_page: 2,
						sort: 'name',
						sort_dir: 'asc',
						filter: null,
					}),
				},
				{
					params: new PetRepository.SearchParams({
						page: 2,
						per_page: 2,
						sort: 'name',
					}),
					result: new PetRepository.SearchResult({
						items: [
							PetModelMapper.toEntity(pets[4]),
							PetModelMapper.toEntity(pets[2]),
						],
						total: 5,
						current_page: 2,
						per_page: 2,
						sort: 'name',
						sort_dir: 'asc',
						filter: null,
					}),
				},
				{
					params: new PetRepository.SearchParams({
						page: 1,
						per_page: 2,
						sort: 'name',
						sort_dir: 'desc',
					}),
					result: new PetRepository.SearchResult({
						items: [
							PetModelMapper.toEntity(pets[3]),
							PetModelMapper.toEntity(pets[2]),
						],
						total: 5,
						current_page: 1,
						per_page: 2,
						sort: 'name',
						sort_dir: 'desc',
						filter: null,
					}),
				},
				{
					params: new PetRepository.SearchParams({
						page: 2,
						per_page: 2,
						sort: 'name',
						sort_dir: 'desc',
					}),
					result: new PetRepository.SearchResult({
						items: [
							PetModelMapper.toEntity(pets[4]),
							PetModelMapper.toEntity(pets[0]),
						],
						total: 5,
						current_page: 2,
						per_page: 2,
						sort: 'name',
						sort_dir: 'desc',
						filter: null,
					}),
				},
			];

			for (const i of arrange) {
				let result = await repository.search(i.params);
				expect(result.toJSON(true)).toMatchObject(
					i.result.toJSON(true)
				);
			}
		});

		it('should apply paginate, sort and filter', async () => {
			const customer = await CustomerSequelize.CustomerModel.factory().create();
			const defaultProps = {
				breed: null,
				gender: null,
				birth_date: null,
				is_active: true,
				created_at: new Date(),
				customer_id: customer.id,
			};

			const petsProp = [
				{
					id: chance.guid({ version: 4 }),
					name: 'some name',
					type: 'dog',
					...defaultProps,
				},
				{
					id: chance.guid({ version: 4 }),
					name: 'other name',
					type: 'cat',
					...defaultProps,
				},
				{
					id: chance.guid({ version: 4 }),
					name: 'some other name',
					type: 'dog',
					...defaultProps,
				},
				{
					id: chance.guid({ version: 4 }),
					name: 'name',
					type: 'cat',
					...defaultProps,
				},
				{
					id: chance.guid({ version: 4 }),
					name: 'some test',
					type: 'dog',
					...defaultProps,
				},
			];
			const pets = await PetModel.bulkCreate(petsProp);

			const arrange = [
				{
					params: new PetRepository.SearchParams({
						page: 1,
						per_page: 2,
						sort: 'name',
						filter: 'some',
					}),
					result: new PetRepository.SearchResult({
						items: [
							PetModelMapper.toEntity(pets[0]),
							PetModelMapper.toEntity(pets[2]),
						],
						total: 3,
						current_page: 1,
						per_page: 2,
						sort: 'name',
						sort_dir: 'asc',
						filter: 'some',
					}),
				},
				{
					params: new PetRepository.SearchParams({
						page: 2,
						per_page: 2,
						sort: 'name',
						filter: 'some',
					}),
					result: new PetRepository.SearchResult({
						items: [PetModelMapper.toEntity(pets[4])],
						total: 3,
						current_page: 2,
						per_page: 2,
						sort: 'name',
						sort_dir: 'asc',
						filter: 'some',
					}),
				},
				{
					params: new PetRepository.SearchParams({
						page: 1,
						per_page: 2,
						sort: 'name',
						sort_dir: 'desc',
						filter: 'some',
					}),
					result: new PetRepository.SearchResult({
						items: [
							PetModelMapper.toEntity(pets[4]),
							PetModelMapper.toEntity(pets[2]),
						],
						total: 3,
						current_page: 1,
						per_page: 2,
						sort: 'name',
						sort_dir: 'desc',
						filter: 'some',
					}),
				},
			];

			for (const i of arrange) {
				let result = await repository.search(i.params);
				expect(result.toJSON(true)).toMatchObject(
					i.result.toJSON(true)
				);
			}
		});
	});

	it('should throw error on update when pet not found', async () => {
		const customer = await CustomerSequelize.CustomerModel.factory().create();
		const pet = new Pet({ name: 'some name', type: 'dog', customer_id: customer.id });
		await expect(repository.update(pet)).rejects.toThrow(
			new NotFoundError(`Entity not found using ID ${pet.id}`)
		);
	});

	it('should update a pet', async () => {
		const customer = await CustomerSequelize.CustomerModel.factory().create();
		const pet = new Pet({ name: 'some name', type: 'dog', customer_id: customer.id });
		await repository.insert(pet);

		pet.update('some name updated', pet.type, pet.customer_id);
		await repository.update(pet);
		let entityFound = await repository.findById(pet.id);

		expect(entityFound.toJSON()).toStrictEqual(pet.toJSON());
	});

	it('should throw error on delete when pet not found', async () => {
		await expect(repository.delete('fake ID')).rejects.toThrow(
			new NotFoundError(`Entity not found using ID fake ID`)
		);

		await expect(
			repository.delete(
				new UniqueEntityId('2658cf7c-1b88-49cf-93be-fcced08b6b0b')
			)
		).rejects.toThrow(
			new NotFoundError(
				`Entity not found using ID 2658cf7c-1b88-49cf-93be-fcced08b6b0b`
			)
		);
	});

	it('should delete a pet', async () => {
		const customer = await CustomerSequelize.CustomerModel.factory().create();
		const pet = new Pet({ name: 'some name', type: 'dog', customer_id: customer.id });
		await repository.insert(pet);

		await repository.delete(pet.id);
		let entityFound = await PetModel.findByPk(pet.id);

		expect(entityFound).toBeNull();
	});
});

import { Customer, CustomerRepository } from '#customer/domain';
import { NotFoundError, UniqueEntityId } from '#seedwork/domain';
import { setupSequelize } from '#seedwork/infra/testing/helpers/db';
import _chance from 'chance';
import { CustomerSequelize } from '../customer-sequelize';

const { CustomerModel, CustomerSequelizeRepository, CustomerModelMapper} = CustomerSequelize;


describe('CustomerRepository Unit Tests', () => {
	setupSequelize({ models: [CustomerModel] });
	let chance: Chance.Chance;
	let repository: CustomerSequelize.CustomerSequelizeRepository;

	beforeAll(() => {
		chance = _chance();
	});

	beforeEach(async () => {
		repository = new CustomerSequelizeRepository(CustomerModel);
	});

	it('should insert a customer', async () => {
		let customer = new Customer({
			name: 'Customer 1',
			type: 'dog',
		});
		await repository.insert(customer);
		let model = await CustomerModel.findByPk(customer.id);
		expect(model.toJSON()).toStrictEqual(customer.toJSON());

		customer = new Customer({
			name: 'Customer 2',
			type: 'cat',
			is_active: false,
		});

		await repository.insert(customer);
		model = await CustomerModel.findByPk(customer.id);
		expect(model.toJSON()).toStrictEqual(customer.toJSON());

		customer = new Customer({
			name: 'Customer 3',
			type: 'dog',
			breed: 'labrador',
			gender: 'Male',
			birth_date: new Date('2021-04-06'),
		});

		await repository.insert(customer);
		model = await CustomerModel.findByPk(customer.id);
		expect(model.toJSON()).toStrictEqual(customer.toJSON());
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
		const entity = new Customer({ name: 'some name', type: 'dog' });
		await repository.insert(entity);

		let entityFound = await repository.findById(entity.id);
		expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());

		entityFound = await repository.findById(entity.uniqueEntityId);
		expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());
	});

	it('should find all entities', async () => {
		const entity1 = new Customer({ name: 'Toto', type: 'dog' });
		const entity2 = new Customer({ name: 'Garfield', type: 'cat' });
		const entity3 = new Customer({ name: 'some name', type: 'dog' });
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
			await CustomerModel.factory()
				.count(16)
				.bulkCreate(() => ({
					id: chance.guid({ version: 4 }),
					name: chance.word(),
					type: chance.animal({ type: 'customer' }),
					breed: null,
					gender: null,
					birth_date: null,
					is_active: chance.bool(),
					created_at: chance.date(),
				}));

			const spyToEntity = jest.spyOn(CustomerModelMapper, 'toEntity');

			const searchOutput = await repository.search(
				new CustomerRepository.SearchParams()
			);

			expect(searchOutput).toBeInstanceOf(CustomerRepository.SearchResult);
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
				expect(item).toBeInstanceOf(Customer);
				expect(item.id).toBeDefined();
			});
		});

		it('should order by name ASC when search params are not provided', async () => {
			await CustomerModel.factory()
				.count(16)
				.bulkCreate((index) => ({
					id: chance.guid({ version: 4 }),
					name: `name ${('0000' + (16 - index)).slice(-4)} `,
					type: chance.animal({ type: 'customer' }),
					breed: null,
					gender: null,
					birth_date: null,
					is_active: chance.bool(),
					created_at: chance.date(),
				}));

			const searchOutput = await repository.search(
				new CustomerRepository.SearchParams()
			);

			searchOutput.items.forEach((item, index) => {
				expect(item.name).toBe(
					`name ${('0000' + (index + 1)).slice(-4)} `
				);
			});
		});

		it('should apply paginate and filter', async () => {
			const defaultProps = {
				type: 'dog',
				breed: null,
				gender: null,
				birth_date: null,
				is_active: true,
				created_at: new Date(),
			};

			const customersProp = [
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
			const customers = await CustomerModel.bulkCreate(customersProp);

			let searchOutput = await repository.search(
				new CustomerRepository.SearchParams({
					page: 1,
					per_page: 2,
					filter: 'TEST',
				})
			);

			expect(searchOutput.toJSON(true)).toMatchObject(
				new CustomerRepository.SearchResult({
					items: [
						CustomerModelMapper.toEntity(customers[2]),
						CustomerModelMapper.toEntity(customers[3]),
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
				new CustomerRepository.SearchParams({
					page: 2,
					per_page: 2,
					filter: 'TEST',
				})
			);
			expect(searchOutput.toJSON(true)).toMatchObject(
				new CustomerRepository.SearchResult({
					items: [CustomerModelMapper.toEntity(customers[0])],
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
			};

			const customersProp = [
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
			const customers = await CustomerModel.bulkCreate(customersProp);

			const arrange = [
				{
					params: new CustomerRepository.SearchParams({
						page: 1,
						per_page: 2,
						sort: 'name',
					}),
					result: new CustomerRepository.SearchResult({
						items: [
							CustomerModelMapper.toEntity(customers[1]),
							CustomerModelMapper.toEntity(customers[0]),
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
					params: new CustomerRepository.SearchParams({
						page: 2,
						per_page: 2,
						sort: 'name',
					}),
					result: new CustomerRepository.SearchResult({
						items: [
							CustomerModelMapper.toEntity(customers[4]),
							CustomerModelMapper.toEntity(customers[2]),
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
					params: new CustomerRepository.SearchParams({
						page: 1,
						per_page: 2,
						sort: 'name',
						sort_dir: 'desc',
					}),
					result: new CustomerRepository.SearchResult({
						items: [
							CustomerModelMapper.toEntity(customers[3]),
							CustomerModelMapper.toEntity(customers[2]),
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
					params: new CustomerRepository.SearchParams({
						page: 2,
						per_page: 2,
						sort: 'name',
						sort_dir: 'desc',
					}),
					result: new CustomerRepository.SearchResult({
						items: [
							CustomerModelMapper.toEntity(customers[4]),
							CustomerModelMapper.toEntity(customers[0]),
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
			const defaultProps = {
				breed: null,
				gender: null,
				birth_date: null,
				is_active: true,
				created_at: new Date(),
			};

			const customersProp = [
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
			const customers = await CustomerModel.bulkCreate(customersProp);

			const arrange = [
				{
					params: new CustomerRepository.SearchParams({
						page: 1,
						per_page: 2,
						sort: 'name',
						filter: 'some',
					}),
					result: new CustomerRepository.SearchResult({
						items: [
							CustomerModelMapper.toEntity(customers[0]),
							CustomerModelMapper.toEntity(customers[2]),
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
					params: new CustomerRepository.SearchParams({
						page: 2,
						per_page: 2,
						sort: 'name',
						filter: 'some',
					}),
					result: new CustomerRepository.SearchResult({
						items: [CustomerModelMapper.toEntity(customers[4])],
						total: 3,
						current_page: 2,
						per_page: 2,
						sort: 'name',
						sort_dir: 'asc',
						filter: 'some',
					}),
				},
				{
					params: new CustomerRepository.SearchParams({
						page: 1,
						per_page: 2,
						sort: 'name',
						sort_dir: 'desc',
						filter: 'some',
					}),
					result: new CustomerRepository.SearchResult({
						items: [
							CustomerModelMapper.toEntity(customers[4]),
							CustomerModelMapper.toEntity(customers[2]),
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

	it('should throw error on update when customer not found', async () => {
		const customer = new Customer({ name: 'some name', type: 'dog' });
		await expect(repository.update(customer)).rejects.toThrow(
			new NotFoundError(`Entity not found using ID ${customer.id}`)
		);
	});

	it('should update a customer', async () => {
		const customer = new Customer({ name: 'some name', type: 'dog' });
		await repository.insert(customer);

		customer.update('some name updated', customer.type);
		await repository.update(customer);
		let entityFound = await repository.findById(customer.id);

		expect(entityFound.toJSON()).toStrictEqual(customer.toJSON());
	});

	it('should throw error on delete when customer not found', async () => {
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

	it('should delete a customer', async () => {
		const customer = new Customer({ name: 'some name', type: 'dog' });
		await repository.insert(customer);

		await repository.delete(customer.id);
		let entityFound = await CustomerModel.findByPk(
			customer.id
		);

		expect(entityFound).toBeNull();
	});
});

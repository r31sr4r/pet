import { Role, RoleRepository } from '#access/domain';
import { NotFoundError, UniqueEntityId } from '#seedwork/domain';
import { setupSequelize } from '#seedwork/infra/testing/helpers/db';
import _chance from 'chance';
import { RoleSequelize } from '../../role-sequelize';

const { RoleModel, RoleSequelizeRepository, RoleModelMapper } =
	RoleSequelize;

const chance = _chance();

describe('RoleRepository Unit Tests', () => {
	setupSequelize({ models: [RoleModel] });
	let repository: RoleSequelize.RoleSequelizeRepository;

	beforeEach(async () => {
		repository = new RoleSequelizeRepository(RoleModel);
	});

	it('should insert a role', async () => {
		let role = new Role({
			name: 'Role 1',
			description: 'Description 1',
		});
		await repository.insert(role);
		let model = await RoleModel.findByPk(role.id);
		expect(model.toJSON()).toStrictEqual(role.toJSON());

		role = new Role({
			name: 'Role 2',
			description: 'Description 2',
			is_active: false,
		});

		await repository.insert(role);
		model = await RoleModel.findByPk(role.id);
		expect(model.toJSON()).toStrictEqual(role.toJSON());

		role = new Role({
			name: 'Role 3',
			description: 'Description 3',
		});

		await repository.insert(role);
		model = await RoleModel.findByPk(role.id);
		expect(model.toJSON()).toStrictEqual(role.toJSON());
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
		const entity = new Role({
			name: 'some name',
			description: 'some description',
		});
		await repository.insert(entity);

		let entityFound = await repository.findById(entity.id);
		expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());

		entityFound = await repository.findById(entity.uniqueEntityId);
		expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());
	});

	it('should return all entities', async () => {
		const entity1 = new Role({
			name: 'some name',
			description: 'some description',
		});
		const entity2 = new Role({
			name: 'some name 2',
			description: 'some description 2',
		});
		await repository.insert(entity1);
		await repository.insert(entity2);

		const entities = await repository.findAll();
		expect(entities.length).toBe(2);
		expect(entities[0].toJSON()).toStrictEqual(entity1.toJSON());
		expect(entities[1].toJSON()).toStrictEqual(entity2.toJSON());
	});

	describe('search method tests', () => {
		it('should apply only paginate when other params are not provided', async () => {
			await RoleModel.factory()
				.count(16)
				.bulkCreate(() => ({
					id: chance.guid({ version: 4 }),
					name: chance.word({ syllables: 3 }),
					description: chance.sentence({ words: 5 }),
					is_active: chance.bool(),
					created_at: chance.date(),
				}));

			const spyToEntity = jest.spyOn(RoleModelMapper, 'toEntity');
			const searchOutput = await repository.search(
				new RoleRepository.SearchParams()
			);

			expect(searchOutput).toBeInstanceOf(RoleRepository.SearchResult);
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
				expect(item).toBeInstanceOf(Role);
				expect(item.id).toBeDefined();
			});
		});

		it('should order by created_at DESC when search params are not provided', async () => {
			const created_at = new Date();
			await RoleModel.factory()
				.count(16)
				.bulkCreate((index) => ({
					id: chance.guid({ version: 4 }),
					name: `name ${index}`,
					description: chance.sentence({ words: 5 }),
					is_active: chance.bool(),
					created_at: new Date(created_at.getTime() + 100 + index),
				}));

			const searchOutput = await repository.search(
				new RoleRepository.SearchParams()
			);

			searchOutput.items.forEach((item, index) => {
				expect(item.name).toBe(`name ${15 - index}`);
			});
		});

		it('should apply paginate and filter', async () => {
			const defaultProps = {
				is_active: true,
				created_at: new Date(),
			};

			const rolesProp = [
				{
					id: chance.guid({ version: 4 }),
					name: 'test',
					description: chance.sentence({ words: 5 }),
					...defaultProps,
				},
				{
					id: chance.guid({ version: 4 }),
					name: 'aaa',
					description: chance.sentence({ words: 5 }),
					...defaultProps,
				},
				{
					id: chance.guid({ version: 4 }),
					name: 'TEST',
					description: chance.sentence({ words: 5 }),
					...defaultProps,
				},
				{
					id: chance.guid({ version: 4 }),
					name: 'TeSt',
					description: chance.sentence({ words: 5 }),
					...defaultProps,
				},
			];
			const roles = await RoleModel.bulkCreate(rolesProp);

			let searchOutput = await repository.search(
				new RoleRepository.SearchParams({
					page: 1,
					per_page: 2,
					filter: 'TEST',
				})
			);
			expect(searchOutput.toJSON(true)).toMatchObject(
				new RoleRepository.SearchResult({
					items: [
						RoleModelMapper.toEntity(roles[0]),
						RoleModelMapper.toEntity(roles[2]),
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
				new RoleRepository.SearchParams({
					page: 2,
					per_page: 2,
					filter: 'TEST',
				})
			);
			expect(searchOutput.toJSON(true)).toMatchObject(
				new RoleRepository.SearchResult({
					items: [RoleModelMapper.toEntity(roles[3])],
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
				'created_at',
			]);
			const defaultProps = {
				description: chance.sentence({ words: 5 }),
				is_active: true,
				created_at: new Date(),
			};

			const rolesProp = [
				{ id: chance.guid({ version: 4 }), name: 'bbb', ...defaultProps },
				{ id: chance.guid({ version: 4 }), name: 'aaa', ...defaultProps },
				{ id: chance.guid({ version: 4 }), name: 'ddd', ...defaultProps },
				{ id: chance.guid({ version: 4 }), name: 'eee', ...defaultProps },
				{ id: chance.guid({ version: 4 }), name: 'ccc', ...defaultProps },
			];
			const roles = await RoleModel.bulkCreate(rolesProp);

			const arrange = [
				{
					params: new RoleRepository.SearchParams({
						page: 1,
						per_page: 2,
						sort: 'name',
					}),
					result: new RoleRepository.SearchResult({
						items: [
							RoleModelMapper.toEntity(roles[1]),
							RoleModelMapper.toEntity(roles[0]),
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
					params: new RoleRepository.SearchParams({
						page: 2,
						per_page: 2,
						sort: 'name',
					}),
					result: new RoleRepository.SearchResult({
						items: [
							RoleModelMapper.toEntity(roles[4]),
							RoleModelMapper.toEntity(roles[2]),
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
					params: new RoleRepository.SearchParams({
						page: 1,
						per_page: 2,
						sort: 'name',
						sort_dir: 'desc',
					}),
					result: new RoleRepository.SearchResult({
						items: [
							RoleModelMapper.toEntity(roles[3]),
							RoleModelMapper.toEntity(roles[2]),
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
					params: new RoleRepository.SearchParams({
						page: 2,
						per_page: 2,
						sort: 'name',
						sort_dir: 'desc',
					}),
					result: new RoleRepository.SearchResult({
						items: [
							RoleModelMapper.toEntity(roles[4]),
							RoleModelMapper.toEntity(roles[0]),
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

		describe('should apply paginate, sort and filter', () => {
			const defaultProps = {
				is_active: true,
				created_at: new Date(),
			};

			const rolesProps = [
				{
					id: chance.guid({ version: 4 }),
					name: 'some name',
					description: 'some description',
					...defaultProps,
				},
				{
					id: chance.guid({ version: 4 }),
					name: 'other name',
					description: 'other description',
					...defaultProps,
				},
				{
					id: chance.guid({ version: 4 }),
					name: 'some other name',
					description: 'some other description',
					...defaultProps,
				},
				{
					id: chance.guid({ version: 4 }),
					name: 'name',
					description: 'description',
					...defaultProps,
				},
				{
					id: chance.guid({ version: 4 }),
					name: 'some test',
					description: 'some description',
					...defaultProps,
				},
			];

			let arrange = [
				{
					params: new RoleRepository.SearchParams({
						page: 1,
						per_page: 2,
						sort: 'name',
						filter: 'some',
					}),
					result: new RoleRepository.SearchResult({
						items: [
							new Role(rolesProps[0]),
							new Role(rolesProps[2]),
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
					params: new RoleRepository.SearchParams({
						page: 2,
						per_page: 2,
						sort: 'name',
						filter: 'some',
					}),
					result: new RoleRepository.SearchResult({
						items: [new Role(rolesProps[4])],
						total: 3,
						current_page: 2,
						per_page: 2,
						sort: 'name',
						sort_dir: 'asc',
						filter: 'some',
					}),
				},
				{
					params: new RoleRepository.SearchParams({
						page: 1,
						per_page: 2,
						sort: 'name',
						sort_dir: 'desc',
						filter: 'some',
					}),
					result: new RoleRepository.SearchResult({
						items: [
							new Role(rolesProps[4]),
							new Role(rolesProps[2]),
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

			beforeEach(async () => {
				await RoleModel.bulkCreate(rolesProps);
			});

			test.each(arrange)(
				'when value is $params',
				async ({ params, result }) => {
					let resultList = await repository.search(params);
					expect(resultList.toJSON(true)).toMatchObject(
						result.toJSON(true)
					);
				}
			);
		});
	});

	it('should throw error on update when role not found', async () => {
		const role = new Role({
			name: 'some name',
			description: 'some description',
		});
		await expect(repository.update(role)).rejects.toThrow(
			new NotFoundError(`Entity not found using ID ${role.id}`)
		);
	});

	it('should update a role', async () => {
		const role = new Role({
			name: 'some name',
			description: 'some description',
		});
		await repository.insert(role);

		role.update('some name updated', role.description);
		await repository.update(role);
		let entityFound = await repository.findById(role.id);

		expect(entityFound.toJSON()).toStrictEqual(role.toJSON());
	});

	it('should throw error on delete when role not found', async () => {
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

	it('should delete a role', async () => {
		const role = new Role({
			name: 'some name',
			description: 'some description',
		});
		await repository.insert(role);

		await repository.delete(role.id);
		let entityFound = await RoleModel.findByPk(role.id);

		expect(entityFound).toBeNull();
	});
});

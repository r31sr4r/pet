import { Group, GroupRepository } from '#access/domain';
import { NotFoundError, UniqueEntityId } from '#seedwork/domain';
import { setupSequelize } from '#seedwork/infra/testing/helpers/db';
import _chance from 'chance';
import { GroupSequelize } from '../../group-sequelize';

const { GroupModel, GroupSequelizeRepository, GroupModelMapper } =
	GroupSequelize;

const chance = _chance();

describe('GroupRepository Unit Tests', () => {
	setupSequelize({ models: [GroupModel] });
	let repository: GroupSequelize.GroupSequelizeRepository;

	beforeEach(async () => {
		repository = new GroupSequelizeRepository(GroupModel);
	});

	it('should insert a group', async () => {
		let group = new Group({
			name: 'Group 1',
			description: 'Description 1',
		});
		await repository.insert(group);
		let model = await GroupModel.findByPk(group.id);
		expect(model.toJSON()).toStrictEqual(group.toJSON());

		group = new Group({
			name: 'Group 2',
			description: 'Description 2',
			is_active: false,
		});

		await repository.insert(group);
		model = await GroupModel.findByPk(group.id);
		expect(model.toJSON()).toStrictEqual(group.toJSON());

		group = new Group({
			name: 'Group 3',
			description: 'Description 3',
		});

		await repository.insert(group);
		model = await GroupModel.findByPk(group.id);
		expect(model.toJSON()).toStrictEqual(group.toJSON());
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
		const entity = new Group({
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
		const entity1 = new Group({
			name: 'some name',
			description: 'some description',
		});
		const entity2 = new Group({
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
			await GroupModel.factory()
				.count(16)
				.bulkCreate(() => ({
					id: chance.guid({ version: 4 }),
					name: chance.word({ syllables: 3 }),
					description: chance.sentence({ words: 5 }),
					is_active: chance.bool(),
					created_at: chance.date(),
				}));

			const spyToEntity = jest.spyOn(GroupModelMapper, 'toEntity');
			const searchOutput = await repository.search(
				new GroupRepository.SearchParams()
			);

			expect(searchOutput).toBeInstanceOf(GroupRepository.SearchResult);
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
				expect(item).toBeInstanceOf(Group);
				expect(item.id).toBeDefined();
			});
		});

		it('should order by created_at DESC when search params are not provided', async () => {
			const created_at = new Date();
			await GroupModel.factory()
				.count(16)
				.bulkCreate((index) => ({
					id: chance.guid({ version: 4 }),
					name: `name ${index}`,
					description: chance.sentence({ words: 5 }),
					is_active: chance.bool(),
					created_at: new Date(created_at.getTime() + 100 + index),
				}));

			const searchOutput = await repository.search(
				new GroupRepository.SearchParams()
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

			const groupsProp = [
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
			const groups = await GroupModel.bulkCreate(groupsProp);

			let searchOutput = await repository.search(
				new GroupRepository.SearchParams({
					page: 1,
					per_page: 2,
					filter: 'TEST',
				})
			);
			expect(searchOutput.toJSON(true)).toMatchObject(
				new GroupRepository.SearchResult({
					items: [
						GroupModelMapper.toEntity(groups[0]),
						GroupModelMapper.toEntity(groups[2]),
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
				new GroupRepository.SearchParams({
					page: 2,
					per_page: 2,
					filter: 'TEST',
				})
			);
			expect(searchOutput.toJSON(true)).toMatchObject(
				new GroupRepository.SearchResult({
					items: [GroupModelMapper.toEntity(groups[3])],
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

			const groupsProp = [
				{
					id: chance.guid({ version: 4 }),
					name: 'bbb',
					...defaultProps,
				},
				{
					id: chance.guid({ version: 4 }),
					name: 'aaa',
					...defaultProps,
				},
				{
					id: chance.guid({ version: 4 }),
					name: 'ddd',
					...defaultProps,
				},
				{
					id: chance.guid({ version: 4 }),
					name: 'eee',
					...defaultProps,
				},
				{
					id: chance.guid({ version: 4 }),
					name: 'ccc',
					...defaultProps,
				},
			];
			const groups = await GroupModel.bulkCreate(groupsProp);

			const arrange = [
				{
					params: new GroupRepository.SearchParams({
						page: 1,
						per_page: 2,
						sort: 'name',
					}),
					result: new GroupRepository.SearchResult({
						items: [
							GroupModelMapper.toEntity(groups[1]),
							GroupModelMapper.toEntity(groups[0]),
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
					params: new GroupRepository.SearchParams({
						page: 2,
						per_page: 2,
						sort: 'name',
					}),
					result: new GroupRepository.SearchResult({
						items: [
							GroupModelMapper.toEntity(groups[4]),
							GroupModelMapper.toEntity(groups[2]),
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
					params: new GroupRepository.SearchParams({
						page: 1,
						per_page: 2,
						sort: 'name',
						sort_dir: 'desc',
					}),
					result: new GroupRepository.SearchResult({
						items: [
							GroupModelMapper.toEntity(groups[3]),
							GroupModelMapper.toEntity(groups[2]),
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
					params: new GroupRepository.SearchParams({
						page: 2,
						per_page: 2,
						sort: 'name',
						sort_dir: 'desc',
					}),
					result: new GroupRepository.SearchResult({
						items: [
							GroupModelMapper.toEntity(groups[4]),
							GroupModelMapper.toEntity(groups[0]),
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

			const groupsProps = [
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
					params: new GroupRepository.SearchParams({
						page: 1,
						per_page: 2,
						sort: 'name',
						filter: 'some',
					}),
					result: new GroupRepository.SearchResult({
						items: [
							new Group(groupsProps[0]),
							new Group(groupsProps[2]),
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
					params: new GroupRepository.SearchParams({
						page: 2,
						per_page: 2,
						sort: 'name',
						filter: 'some',
					}),
					result: new GroupRepository.SearchResult({
						items: [new Group(groupsProps[4])],
						total: 3,
						current_page: 2,
						per_page: 2,
						sort: 'name',
						sort_dir: 'asc',
						filter: 'some',
					}),
				},
				{
					params: new GroupRepository.SearchParams({
						page: 1,
						per_page: 2,
						sort: 'name',
						sort_dir: 'desc',
						filter: 'some',
					}),
					result: new GroupRepository.SearchResult({
						items: [
							new Group(groupsProps[4]),
							new Group(groupsProps[2]),
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
				await GroupModel.bulkCreate(groupsProps);
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

	it('should throw error on update when group not found', async () => {
		const group = new Group({
			name: 'some name',
			description: 'some description',
		});
		await expect(repository.update(group)).rejects.toThrow(
			new NotFoundError(`Entity not found using ID ${group.id}`)
		);
	});

	it('should update a group', async () => {
		const group = new Group({
			name: 'some name',
			description: 'some description',
		});
		await repository.insert(group);

		group.update('some name updated', group.description);
		await repository.update(group);
		let entityFound = await repository.findById(group.id);

		expect(entityFound.toJSON()).toStrictEqual(group.toJSON());
	});

	it('should throw error on delete when group not found', async () => {
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

	it('should delete a group', async () => {
		const group = new Group({
			name: 'some name',
			description: 'some description',
		});
		await repository.insert(group);

		await repository.delete(group.id);
		let entityFound = await GroupModel.findByPk(group.id);

		expect(entityFound).toBeNull();
	});

	it('shold return false when group not found', async () => {
		const group = new Group({
			name: 'some name',
			description: 'some description',
		});
		await repository.insert(group);

		let result = await repository.exists('fake name');
		expect(result).toBe(false);

		result = await repository.exists(null);
		expect(result).toBe(false);
	});

	it('should return true when group found', async () => {
		const group = new Group({
			name: 'some name',
			description: 'some description',
		});
		await repository.insert(group);

		let result = await repository.exists(group.name);
		expect(result).toBe(true);
	});

});

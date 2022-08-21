import { User, UserRepository } from '#user/domain';
import {
	NotFoundError,
	UniqueEntityId,
	ValidationError,
} from '#seedwork/domain';
import { setupSequelize } from '#seedwork/infra/testing/helpers/db';
import _chance from 'chance';
import { UserSequelize } from '../user-sequelize';

const { UserModel, UserSequelizeRepository, UserModelMapper } = UserSequelize;

describe('UserRepository Integration Tests', () => {
	setupSequelize({ models: [UserModel] });
	let chance: Chance.Chance;
	let repository: UserSequelize.UserSequelizeRepository;

	beforeAll(() => {
		chance = _chance();
	});

	beforeEach(async () => {
		repository = new UserSequelizeRepository(UserModel);
	});

	it('should insert a user', async () => {
		let user = new User({
			name: 'User 1',
			email: 'somemail@mail.com',
			password: 'Some password1',
		});
		await repository.insert(user);
		let model = await UserModel.findByPk(user.id);
		expect(model.toJSON()).toStrictEqual(user.toJSON());

		user = new User({
			name: 'User 2',
			email: 'somemail2@mail.com',
			password: 'Some password1',
			is_active: false,
		});

		await repository.insert(user);
		model = await UserModel.findByPk(user.id);
		expect(model.toJSON()).toStrictEqual(user.toJSON());

		user = new User({
			name: 'User 3',
			email: 'somemail3@mail.com',
			password: 'Some password1',
		});

		await repository.insert(user);
		model = await UserModel.findByPk(user.id);
		expect(model.toJSON()).toStrictEqual(user.toJSON());
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
		const entity = new User({
			name: 'some name',
			email: 'somemail@mail.com',
			password: 'Some password1',
		});
		await repository.insert(entity);

		let entityFound = await repository.findById(entity.id);
		expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());

		entityFound = await repository.findById(entity.uniqueEntityId);
		expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());
	});

	it('should find all entities', async () => {
		const entity1 = new User({
			name: 'Toto',
			email: 'somemail@mail.com',
			password: 'Some password1',
		});
		const entity2 = new User({
			name: 'Garfield',
			email: 'somemail2@mail.com',
			password: 'Some password1',
		});
		const entity3 = new User({
			name: 'some name',
			email: 'somemail3@mail.com',
			password: 'Some password1',
		});
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
			await UserModel.factory()
				.count(16)
				.bulkCreate(() => ({
					id: chance.guid({ version: 4 }),
					name: chance.name(),
					email: chance.email(),
					password: 'Some password1',
					is_active: chance.bool(),
					created_at: chance.date(),
				}));

			const spyToEntity = jest.spyOn(UserModelMapper, 'toEntity');

			const searchOutput = await repository.search(
				new UserRepository.SearchParams()
			);

			expect(searchOutput).toBeInstanceOf(UserRepository.SearchResult);
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
				expect(item).toBeInstanceOf(User);
				expect(item.id).toBeDefined();
			});
		});

		it('should order by name ASC when search params are not provided', async () => {
			await UserModel.factory()
				.count(16)
				.bulkCreate((index) => ({
					id: chance.guid({ version: 4 }),
					name: `name ${('0000' + (16 - index)).slice(-4)} `,
					email: chance.email(),
					password: 'Some password1',
					is_active: chance.bool(),
					created_at: chance.date(),
				}));

			const searchOutput = await repository.search(
				new UserRepository.SearchParams()
			);

			searchOutput.items.forEach((item, index) => {
				expect(item.name).toBe(
					`name ${('0000' + (index + 1)).slice(-4)} `
				);
			});
		});

		it('should apply paginate and filter', async () => {
			const defaultProps = {
				password: 'Some password1',
				is_active: true,
				created_at: new Date(),
			};

			const usersProp = [
				{
					id: chance.guid({ version: 4 }),
					name: 'test',
					email: chance.email(),
					...defaultProps,
				},
				{
					id: chance.guid({ version: 4 }),
					name: 'aaa',
					email: chance.email(),
					...defaultProps,
				},
				{
					id: chance.guid({ version: 4 }),
					name: 'TEST',
					email: chance.email(),
					...defaultProps,
				},
				{
					id: chance.guid({ version: 4 }),
					name: 'TeSt',
					email: chance.email(),
					...defaultProps,
				},
			];
			const users = await UserModel.bulkCreate(usersProp);

			let searchOutput = await repository.search(
				new UserRepository.SearchParams({
					page: 1,
					per_page: 2,
					filter: 'TEST',
				})
			);

			expect(searchOutput.toJSON(true)).toMatchObject(
				new UserRepository.SearchResult({
					items: [
						UserModelMapper.toEntity(users[2]),
						UserModelMapper.toEntity(users[3]),
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
				new UserRepository.SearchParams({
					page: 2,
					per_page: 2,
					filter: 'TEST',
				})
			);
			expect(searchOutput.toJSON(true)).toMatchObject(
				new UserRepository.SearchResult({
					items: [UserModelMapper.toEntity(users[0])],
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
				'email',
				'created_at',
			]);
			const defaultProps = {
				password: 'Some password1',
				is_active: true,
				created_at: new Date(),
			};

			const usersProp = [
				{
					id: chance.guid({ version: 4 }),
					name: 'bbb',
					email: chance.email(),
					...defaultProps,
				},
				{
					id: chance.guid({ version: 4 }),
					name: 'aaa',
					email: chance.email(),
					...defaultProps,
				},
				{
					id: chance.guid({ version: 4 }),
					name: 'ddd',
					email: chance.email(),
					...defaultProps,
				},
				{
					id: chance.guid({ version: 4 }),
					name: 'eee',
					email: chance.email(),
					...defaultProps,
				},
				{
					id: chance.guid({ version: 4 }),
					name: 'ccc',
					email: chance.email(),
					...defaultProps,
				},
			];
			const users = await UserModel.bulkCreate(usersProp);

			const arrange = [
				{
					params: new UserRepository.SearchParams({
						page: 1,
						per_page: 2,
						sort: 'name',
					}),
					result: new UserRepository.SearchResult({
						items: [
							UserModelMapper.toEntity(users[1]),
							UserModelMapper.toEntity(users[0]),
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
					params: new UserRepository.SearchParams({
						page: 2,
						per_page: 2,
						sort: 'name',
					}),
					result: new UserRepository.SearchResult({
						items: [
							UserModelMapper.toEntity(users[4]),
							UserModelMapper.toEntity(users[2]),
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
					params: new UserRepository.SearchParams({
						page: 1,
						per_page: 2,
						sort: 'name',
						sort_dir: 'desc',
					}),
					result: new UserRepository.SearchResult({
						items: [
							UserModelMapper.toEntity(users[3]),
							UserModelMapper.toEntity(users[2]),
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
					params: new UserRepository.SearchParams({
						page: 2,
						per_page: 2,
						sort: 'name',
						sort_dir: 'desc',
					}),
					result: new UserRepository.SearchResult({
						items: [
							UserModelMapper.toEntity(users[4]),
							UserModelMapper.toEntity(users[0]),
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
				password: 'Some password1',
				is_active: true,
				created_at: new Date(),
			};

			const usersProp = [
				{
					id: chance.guid({ version: 4 }),
					name: 'some name',
					email: chance.email(),
					...defaultProps,
				},
				{
					id: chance.guid({ version: 4 }),
					name: 'other name',
					email: chance.email(),
					...defaultProps,
				},
				{
					id: chance.guid({ version: 4 }),
					name: 'some other name',
					email: chance.email(),
					...defaultProps,
				},
				{
					id: chance.guid({ version: 4 }),
					name: 'name',
					email: chance.email(),
					...defaultProps,
				},
				{
					id: chance.guid({ version: 4 }),
					name: 'some test',
					email: chance.email(),
					...defaultProps,
				},
			];
			const users = await UserModel.bulkCreate(usersProp);

			const arrange = [
				{
					params: new UserRepository.SearchParams({
						page: 1,
						per_page: 2,
						sort: 'name',
						filter: 'some',
					}),
					result: new UserRepository.SearchResult({
						items: [
							UserModelMapper.toEntity(users[0]),
							UserModelMapper.toEntity(users[2]),
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
					params: new UserRepository.SearchParams({
						page: 2,
						per_page: 2,
						sort: 'name',
						filter: 'some',
					}),
					result: new UserRepository.SearchResult({
						items: [UserModelMapper.toEntity(users[4])],
						total: 3,
						current_page: 2,
						per_page: 2,
						sort: 'name',
						sort_dir: 'asc',
						filter: 'some',
					}),
				},
				{
					params: new UserRepository.SearchParams({
						page: 1,
						per_page: 2,
						sort: 'name',
						sort_dir: 'desc',
						filter: 'some',
					}),
					result: new UserRepository.SearchResult({
						items: [
							UserModelMapper.toEntity(users[4]),
							UserModelMapper.toEntity(users[2]),
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

	it('should throw error on update when user not found', async () => {
		const user = new User({
			name: 'some name',
			email: 'somemail@mail.com',
			password: 'Some password1',
		});
		await expect(repository.update(user)).rejects.toThrow(
			new NotFoundError(`Entity not found using ID ${user.id}`)
		);
	});

	it('should update a user', async () => {
		const user = new User({
			name: 'some name',
			email: 'somemail@mail.com',
			password: 'Some password1',
		});
		await repository.insert(user);

		user.update('some name updated', user.email);
		await repository.update(user);
		let entityFound = await repository.findById(user.id);

		expect(entityFound.toJSON()).toStrictEqual(user.toJSON());

		user.update('some name updated', 'user.email@gmail.com');
		await repository.update(user);
		entityFound = await repository.findById(user.id);

		expect(entityFound.toJSON()).toStrictEqual(user.toJSON());
	});

	it('should throw error on delete when user not found', async () => {
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

	it('should delete a user', async () => {
		const user = new User({
			name: 'some name',
			email: 'somemail@mail.com',
			password: 'Some password1',
		});
		await repository.insert(user);

		await repository.delete(user.id);
		let entityFound = await UserModel.findByPk(user.id);

		expect(entityFound).toBeNull();
	});

	it('should throw a ValidationError on trying to update password with invalid current password', async () => {
		const user = new User({
			name: 'some name',
			email: 'somemail@mail.com',
			password: 'Some password1',
		});

		await repository.insert(user);

		expect(() => {
			user.updatePassword('SomeInvalidCurrent', 'Otherpass1');
		}).toThrow(ValidationError);
	});

	it('should update a user with a new password', async () => {
		const user = new User({
			name: 'some name',
			email: 'somemail@mail.com',
			password: 'Some password1',
		});
		await repository.insert(user);

		user.updatePassword('Some password1', 'New password2');
		await repository.updatePassword(user.id, user.password);
		let entityFound = await repository.findById(user.id);

		expect(entityFound.toJSON()).toStrictEqual(user.toJSON());

		user.updatePassword('New password2', 'Some New password3');
		await repository.updatePassword(user.id, user.password);
		entityFound = await repository.findById(user.id);

		expect(entityFound.toJSON()).toStrictEqual(user.toJSON());
	});

	it('should throw an error if email is already registered', async () => {
		const user = new User({
			name: 'some name',
			email: 'somemail@mail.com',
			password: 'Some password1',
		});

		await repository.insert(user);

		const user2 = new User({
			name: 'other name',
			email: 'somemail@mail.com',
			password: 'Some password2',
		});

		await expect(repository.insert(user2)).rejects.toThrow(
			new ValidationError(`Entity already exists using email ${user2.email}`)
		);
	});
});

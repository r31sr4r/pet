import {
	UserAssignedToGroupAndRoleRepository,
	UserAssignedToGroupAndRole,
} from '#access/domain';
import { NotFoundError, UniqueEntityId } from '#seedwork/domain';
import { setupSequelize } from '#seedwork/infra/testing/helpers/db';
import { UserSequelize } from '#user/infra';
import _chance from 'chance';
import { GroupSequelize } from '../../group-sequelize';
import { RoleSequelize } from '../../role-sequelize';
import { UserAssignedToGroupAndRoleSequelize } from '../../user-assigned-to-group-and-role-sequelize';

const { RoleModel } = RoleSequelize;

const {
	UserAssignedToGroupAndRoleModel,
	UserAssignedToGroupAndRoleSequelizeRepository,
	UserAssignedToGroupAndRoleModelMapper,
} = UserAssignedToGroupAndRoleSequelize;

const { UserModel } = UserSequelize;

const { GroupModel } = GroupSequelize;

const chance = _chance();

describe('UserAssignedToGroupAndRoleSequelizeRepository Unit Tests', () => {
	setupSequelize({
		models: [
			RoleModel,
			UserAssignedToGroupAndRoleModel,
			UserModel,
			GroupModel,
		],
	});
	let repository: UserAssignedToGroupAndRoleSequelize.UserAssignedToGroupAndRoleSequelizeRepository;

	beforeEach(async () => {
		repository = new UserAssignedToGroupAndRoleSequelizeRepository(
			UserAssignedToGroupAndRoleModel
		);
	});

	it('should insert a userAssignedToGroupAndRole', async () => {
		const user = await UserModel.factory().create();

		const group = await GroupModel.factory().create();
		const group2 = await GroupModel.factory().create();

		const role = await RoleModel.factory().create();

		let userAssignedToGroupAndRole = new UserAssignedToGroupAndRole({
			user_id: user.id,
			group_id: group.id,
			role_id: role.id,
		});

		await repository.insert(userAssignedToGroupAndRole);
		let model = await UserAssignedToGroupAndRoleModel.findByPk(
			userAssignedToGroupAndRole.id
		);
		expect(model.toJSON()).toStrictEqual(
			userAssignedToGroupAndRole.toJSON()
		);

		userAssignedToGroupAndRole = new UserAssignedToGroupAndRole({
			user_id: user.id,
			group_id: group2.id,
			role_id: role.id,
		});

		await repository.insert(userAssignedToGroupAndRole);
		model = await UserAssignedToGroupAndRoleModel.findByPk(
			userAssignedToGroupAndRole.id
		);
		expect(model.toJSON()).toStrictEqual(
			userAssignedToGroupAndRole.toJSON()
		);
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
		const user = await UserModel.factory().create();

		const group = await GroupModel.factory().create();

		const role = await RoleModel.factory().create();

		let userAssignedToGroupAndRole = new UserAssignedToGroupAndRole({
			user_id: user.id,
			group_id: group.id,
			role_id: role.id,
		});

		await repository.insert(userAssignedToGroupAndRole);
		let model = await UserAssignedToGroupAndRoleModel.findByPk(
			userAssignedToGroupAndRole.id
		);

		expect(model.toJSON()).toStrictEqual(
			userAssignedToGroupAndRole.toJSON()
		);

		let entityFound = await repository.findById(
			userAssignedToGroupAndRole.id
		);
		expect(userAssignedToGroupAndRole.toJSON()).toStrictEqual(
			entityFound.toJSON()
		);

		entityFound = await repository.findById(
			userAssignedToGroupAndRole.uniqueEntityId
		);
		expect(userAssignedToGroupAndRole.toJSON()).toStrictEqual(
			entityFound.toJSON()
		);
	});

	it('should return all entities', async () => {
		const user = await UserModel.factory().create();

		const group = await GroupModel.factory().create();
		const group2 = await GroupModel.factory().create();

		const role = await RoleModel.factory().create();

		const entity1 = new UserAssignedToGroupAndRole({
			user_id: user.id,
			group_id: group.id,
			role_id: role.id,
		});

		await repository.insert(entity1);

		const entity2 = new UserAssignedToGroupAndRole({
			user_id: user.id,
			group_id: group2.id,
			role_id: role.id,
		});

		await repository.insert(entity2);

		const entities = await repository.findAll();
		expect(entities.length).toBe(2);
		expect(entities[0].toJSON()).toStrictEqual(entity1.toJSON());
		expect(entities[1].toJSON()).toStrictEqual(entity2.toJSON());
	});

	describe('search method tests', () => {
		it('should apply only paginate when other params are not provided', async () => {
			await (await UserAssignedToGroupAndRoleModel.factory())
				.count(16)
				.bulkCreate();

			const spyToEntity = jest.spyOn(
				UserAssignedToGroupAndRoleModelMapper,
				'toEntity'
			);
			const searchOutput = await repository.search(
				new UserAssignedToGroupAndRoleRepository.SearchParams()
			);

			expect(searchOutput).toBeInstanceOf(
				UserAssignedToGroupAndRoleRepository.SearchResult
			);
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
				expect(item).toBeInstanceOf(UserAssignedToGroupAndRole);
				expect(item.id).toBeDefined();
			});
		});

		it('should order by created_at DESC when search params are not provided', async () => {
			await (await UserAssignedToGroupAndRoleModel.factory())
				.count(16)
				.bulkCreate();

			const searchOutput = await repository.search(
				new UserAssignedToGroupAndRoleRepository.SearchParams()
			);

			searchOutput.items.forEach((item, index) => {
				if (index > 0) {
					expect(
						searchOutput.items[index - 1].created_at.getTime()
					).toBeGreaterThan(item.created_at.getTime());
				}
			});
		});
	});

	it('should throw error on update when role not found', async () => {
		const userAssignedToGroupAndRole = new UserAssignedToGroupAndRole({
			user_id: '104508d2-0e18-4bd1-a0f1-2de75a835801',
			group_id: '104508d2-0e18-4bd1-a0f1-2de75a835801',
			role_id: '104508d2-0e18-4bd1-a0f1-2de75a835801',
		});
		await expect(
			repository.update(userAssignedToGroupAndRole)
		).rejects.toThrow(
			new NotFoundError(
				`Entity not found using ID ${userAssignedToGroupAndRole.id}`
			)
		);
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
		const user = await UserModel.factory().create();

		const group = await GroupModel.factory().create();

		const role = await RoleModel.factory().create();

		let userAssignedToGroupAndRole = new UserAssignedToGroupAndRole({
			user_id: user.id,
			group_id: group.id,
			role_id: role.id,
		});

		await repository.insert(userAssignedToGroupAndRole);

		await repository.delete(userAssignedToGroupAndRole.id);
		let entityFound = await UserAssignedToGroupAndRoleModel.findByPk(role.id);

		expect(entityFound).toBeNull();
	});
});

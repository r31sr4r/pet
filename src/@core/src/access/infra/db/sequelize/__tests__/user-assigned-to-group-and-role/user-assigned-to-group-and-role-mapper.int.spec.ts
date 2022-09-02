import { LoadEntityError, UniqueEntityId } from '#seedwork/domain';
import { UserAssignedToGroupAndRoleSequelize } from '../../user-assigned-to-group-and-role-sequelize';
import { UserAssignedToGroupAndRole } from '#access/domain';
import { setupSequelize } from '#seedwork/infra/testing/helpers/db';
import { UserSequelize } from '#user/infra';
import { GroupSequelize } from '../../group-sequelize';
import { RoleSequelize } from '../../role-sequelize';

const {
	UserAssignedToGroupAndRoleModel,
	UserAssignedToGroupAndRoleModelMapper,
} = UserAssignedToGroupAndRoleSequelize;

describe('UserAssignedToGroupAndRoleMapper Unit Tests', () => {
	setupSequelize({
		models: [
			UserAssignedToGroupAndRoleModel,
			UserSequelize.UserModel,
			GroupSequelize.GroupModel,
			RoleSequelize.RoleModel,
		],
	});

	it('should throw an error when entity is invalid', async () => {
		const model = UserAssignedToGroupAndRoleModel.build({
			id: '02b090cf-5658-4073-b242-9bf64915b3ad',
		});
		try {
			UserAssignedToGroupAndRoleModelMapper.toEntity(model);
			fail('The role is valid but an error was expected');
		} catch (err) {
			expect(err).toBeInstanceOf(LoadEntityError);
			expect(err.error).toMatchObject({
				user_id: [
					'user_id should not be empty',
					'user_id must be a UUID'
				],
			});
			expect(err.message).toBe('An entity could not be loaded');
		}
	});

	it('should throw a generic error', async () => {
		const error = new Error('An error has occurred');
		const spyValidate = jest
			.spyOn(UserAssignedToGroupAndRole, 'validate')
			.mockImplementation(() => {
				throw error;
			});
		const model = UserAssignedToGroupAndRoleModel.build({
			id: '02b090cf-5658-4073-b242-9bf64915b3ad',
		});

		expect(() => UserAssignedToGroupAndRoleModelMapper.toEntity(model)).toThrow(error);
		expect(spyValidate).toHaveBeenCalled();
		spyValidate.mockRestore();
	});

	it('should map a user/group/role model to a entity', async () => {
		const created_at = new Date();

		const user =
			await UserSequelize.UserModel.factory().create();

		const group =
			await GroupSequelize.GroupModel.factory().create();

		const role =
			await RoleSequelize.RoleModel.factory().create();

		const model = UserAssignedToGroupAndRoleModel.build({
			id: '02b090cf-5658-4073-b242-9bf64915b3ad',
			user_id: user.id,
			group_id: group.id,
			role_id: role.id,			
			created_at,
		});

		const entity = UserAssignedToGroupAndRoleModelMapper.toEntity(model);

		expect(entity.toJSON()).toStrictEqual(
			new UserAssignedToGroupAndRole(
				{
					user_id: user.id,
					group_id: group.id,
					role_id: role.id,
					created_at,
				},
				new UniqueEntityId('02b090cf-5658-4073-b242-9bf64915b3ad')
			).toJSON()
		);
	});
});

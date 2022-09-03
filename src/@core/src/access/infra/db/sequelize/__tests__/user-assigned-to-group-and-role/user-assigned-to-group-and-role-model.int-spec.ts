import { setupSequelize } from '#seedwork/infra/testing/helpers/db';
import { UserSequelize } from '#user/infra';
import { DataType } from 'sequelize-typescript';
import { GroupSequelize } from '../../group-sequelize';
import { RoleSequelize } from '../../role-sequelize';
import { UserAssignedToGroupAndRoleSequelize } from '../../user-assigned-to-group-and-role-sequelize';

const { UserAssignedToGroupAndRoleModel } = UserAssignedToGroupAndRoleSequelize;

describe('UserAssignedToGroupAndRoleModel Unit Tests', () => {
	setupSequelize({
		models: [
			UserAssignedToGroupAndRoleModel,
			UserSequelize.UserModel,
			GroupSequelize.GroupModel,
			RoleSequelize.RoleModel,
		],
	});

	test('mapping props to columns', async () => {
		const attributesMap = UserAssignedToGroupAndRoleModel.getAttributes();
		const attributes = Object.keys(attributesMap);
		expect(attributes.length).toBe(5);
		expect(attributes).toStrictEqual([
			'id',
			'user_id',
			'group_id',
			'role_id',
			'created_at',
		]);

		const idAttr = attributesMap.id;
		expect(idAttr).toMatchObject({
			field: 'id',
			fieldName: 'id',
			primaryKey: true,
			type: DataType.UUID(),
		});

		const userIdAttr = attributesMap.user_id;
		expect(userIdAttr).toMatchObject({
			field: 'user_id',
			fieldName: 'user_id',
			allowNull: false,
			type: DataType.UUID(),
		});

		const groupIdAttr = attributesMap.group_id;
		expect(groupIdAttr).toMatchObject({
			field: 'group_id',
			fieldName: 'group_id',
			allowNull: false,
			type: DataType.UUID(),
		});

		const roleIdAttr = attributesMap.role_id;
		expect(roleIdAttr).toMatchObject({
			field: 'role_id',
			fieldName: 'role_id',
			allowNull: false,
			type: DataType.UUID(),
		});

		const createdAtAttr = attributesMap.created_at;
		expect(createdAtAttr).toMatchObject({
			field: 'created_at',
			fieldName: 'created_at',
			allowNull: false,
			type: DataType.DATE(),
		});
	});

	it('should create a new userAssignedToGroupAndRole', async () => {
		const user = await UserSequelize.UserModel.factory().create();

		const group = await GroupSequelize.GroupModel.factory().create();

		const role = await RoleSequelize.RoleModel.factory().create();

		const arrange = {
			id: '104508d2-0e18-4bd1-a0f1-2de75a835801',
			user_id: user.id,
			group_id: group.id,
			role_id: role.id,
			created_at: new Date(),
		};

		const userAssignedToGroupAndRole =
			await UserAssignedToGroupAndRoleModel.create(arrange);

		expect(userAssignedToGroupAndRole).toBeDefined();
		expect(userAssignedToGroupAndRole.toJSON()).toStrictEqual(arrange);
	});
});

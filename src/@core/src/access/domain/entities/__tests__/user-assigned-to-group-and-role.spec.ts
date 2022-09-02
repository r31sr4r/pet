import { UniqueEntityId } from '#seedwork/domain';
import { omit } from 'lodash';
import { User } from '../../../../user/domain/entities/user';
import { Group } from '../group';
import { Role } from '../role';
import {
	UserAssignedToGroupAndRole,
	UserAssignedToGroupAndRoleProperties,
} from '../user-assigned-to-group-and-role';
import { validate as uuidValidate } from 'uuid';


describe('UserAssignedToGroupAndRole Unit Tests', () => {
	it('constructor of UserAssignedToGroupAndRole', () => {
		let userAssignedToGroupAndRole = new UserAssignedToGroupAndRole({
			user_id: 'be19223a-598d-489d-8753-7aceb7b3c1b2',
			group_id: 'df359551-a92e-4d14-a593-d9d44ffd0de8',
			role_id: '10f911ea-1fa8-4021-a364-b2b07e44ca3b',
		});

		expect(userAssignedToGroupAndRole.id).toBeDefined();

		let props = omit(userAssignedToGroupAndRole.props, ['created_at']);

		expect(props).toStrictEqual({
			user_id: 'be19223a-598d-489d-8753-7aceb7b3c1b2',
			group_id: 'df359551-a92e-4d14-a593-d9d44ffd0de8',
			role_id: '10f911ea-1fa8-4021-a364-b2b07e44ca3b',
		});

		let created_at = new Date();
		userAssignedToGroupAndRole = new UserAssignedToGroupAndRole({
			user_id: 'be19223a-598d-489d-8753-7aceb7b3c1b2',
			group_id: 'df359551-a92e-4d14-a593-d9d44ffd0de8',
			role_id: '10f911ea-1fa8-4021-a364-b2b07e44ca3b',
			created_at,
		});

		expect(userAssignedToGroupAndRole.props).toStrictEqual({
			user_id: 'be19223a-598d-489d-8753-7aceb7b3c1b2',
			group_id: 'df359551-a92e-4d14-a593-d9d44ffd0de8',
			role_id: '10f911ea-1fa8-4021-a364-b2b07e44ca3b',
			created_at,
		});
	});

	it('id field', () => {
		type UserAssignedToGroupAndRoleData = {
			props: UserAssignedToGroupAndRoleProperties;
			id?: UniqueEntityId;
		};
		const data: UserAssignedToGroupAndRoleData[] = [
			{
				props: {					
						user_id: 'be19223a-598d-489d-8753-7aceb7b3c1b2',
						group_id: 'df359551-a92e-4d14-a593-d9d44ffd0de8',
						role_id: '10f911ea-1fa8-4021-a364-b2b07e44ca3b',
					}				             
			}
		];        

        data.forEach((item) => {
			const role = new UserAssignedToGroupAndRole(item.props, item.id);
			expect(role.id).not.toBeNull();
			expect(uuidValidate(role.id.toString())).toBeTruthy();
		});
	});

	test('getter and setter of created_at prop', () => {

        let userAssignedToGroupAndRole = new UserAssignedToGroupAndRole({
			user_id: 'be19223a-598d-489d-8753-7aceb7b3c1b2',
			group_id: 'df359551-a92e-4d14-a593-d9d44ffd0de8',
			role_id: '10f911ea-1fa8-4021-a364-b2b07e44ca3b',
            created_at: new Date(),
        });

        expect(userAssignedToGroupAndRole.created_at).toBeInstanceOf(Date);

    });

});

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
		let user = new User({
			name: 'Some name',
			email: 'somemail@mail.com',
			password: 'Some password',
		});

		let group = new Group({
			name: 'Customers',
			description: 'Some description',
		});

		let role = new Role({
			name: 'Vets',
			description: 'Some description',
		});

		let userAssignedToGroupAndRole = new UserAssignedToGroupAndRole({
			user: user,
			group: group,
			role: role,
		});

		let props = omit(userAssignedToGroupAndRole.props, ['created_at']);

		expect(props).toStrictEqual({
			user: user,
			group: group,
			role: role,
		});

		let created_at = new Date();
		userAssignedToGroupAndRole = new UserAssignedToGroupAndRole({
			user: user,
			group: group,
			role: role,
			created_at,
		});

		expect(userAssignedToGroupAndRole.props).toStrictEqual({
			user: user,
			group: group,
			role: role,
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
					user: new User({
						name: 'Some name',
						email: 'somemail@mail.com',
						password: 'Some password',
					}),
					group: new Group({
						name: 'Customers',
						description: 'Some description',
					}),
					role: new Role({
						name: 'Users',
						description: 'Some description',
					}),
				},                
			},
            {
                props: {
                    user: new User({
                        name: 'John Doe',
                        email: 'john@mail.com',
                        password: 'Some password',
                    }),
                    group: new Group({
                        name: 'Vets',
                        description: 'Some description',
                    }),
                    role: new Role({
                        name: 'Admin',
                        description: 'Some description',
                    }),
                },
            },

		];        

        data.forEach((item) => {
			const role = new UserAssignedToGroupAndRole(item.props, item.id);
			expect(role.id).not.toBeNull();
			expect(uuidValidate(role.id.toString())).toBeTruthy();
		});
	});

	test('getter and setter of created_at prop', () => {
        let user = new User({
            name: 'Paul McCartney',
            email: 'paul@mail.com',
            password: 'Some password',
        });

        let group = new Group({
            name: 'Customers',
            description: 'Some description',
        });

        let role = new Role({
            name: 'Users',
            description: 'Some description',
        });

        let userAssignedToGroupAndRole = new UserAssignedToGroupAndRole({
            user,
            group,
            role,
            created_at: new Date(),
        });

        expect(userAssignedToGroupAndRole.created_at).toBeInstanceOf(Date);

    });

});

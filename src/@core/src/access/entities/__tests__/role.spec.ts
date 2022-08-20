import { UniqueEntityId } from '#seedwork/domain';
import { omit } from 'lodash';
import { Role, RoleProperties } from '../role';

describe('Role Unit Tests', () => {
	beforeEach(() => {
		Role.validate = jest.fn();
	});

	test('constructor of Role', () => {
		let role = new Role({
			name: 'Some name',
			description: 'Some description',
			is_active: true,
		});
		let props = omit(role.props, ['created_at']);

		expect(Role.validate).toHaveBeenCalled();
		expect(props).toStrictEqual({
			name: 'Some name',
			description: 'Some description',
			is_active: true,
		});
		role = new Role({
			name: 'Some name',
			description: 'Some description',
			is_active: false,
		});
		props = omit(role.props, ['created_at']);

		expect(props).toStrictEqual({
			name: 'Some name',
			description: 'Some description',
			is_active: false,
		});
		let created_at = new Date();
		role = new Role({
			name: 'Some name',
			description: 'Some description',
			is_active: false,
			created_at,
		});
		expect(role.props).toStrictEqual({
			name: 'Some name',
			description: 'Some description',
			is_active: false,
			created_at,
		});
	});

    test('id field', () => {
        type RoleData = { props: RoleProperties; id?: UniqueEntityId };
        const data: RoleData[] = [
            { props: { name: 'Some name', description: 'Some description', is_active: true } },
            { props: { name: 'Some name', description: 'Some description', is_active: false } },
        ];
        data.forEach(({ props, id }) => {
            const role = new Role(props);
            expect(role.id).toBeInstanceOf(UniqueEntityId);
            if (id) {
                expect(role.id).toEqual(id);
            }
        }
        );
    });

});

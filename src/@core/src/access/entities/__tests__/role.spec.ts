import { UniqueEntityId } from '#seedwork/domain';
import { omit } from 'lodash';
import { Role, RoleProperties } from '../role';
import { validate as uuidValidate } from 'uuid';

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
			{
				props: {
					name: 'Some name',
					description: 'Some description',
					is_active: true,
				},
			},
			{
				props: {
					name: 'Some name',
					description: 'Some description',
					is_active: false,
				},
			},
		];
		data.forEach((item) => {
			const role = new Role(item.props, item.id);
			expect(role.id).not.toBeNull();
			expect(uuidValidate(role.id.toString())).toBeTruthy();
		});
	});

	test('getter of name prop', () => {
		const role = new Role({ name: 'Vet', description: 'Some description' });
		expect(role.name).toBe('Vet');
	});

	test('getter and setter of description prop', () => {
		let role = new Role({
			name: 'Customer',
			description: 'Some description',
		});
		expect(role.description).toBe('Some description');

		role = new Role({
			name: 'Veterinary',
			description: 'Description of veterinary',
		});
		expect(role.description).toBe('Description of veterinary');

		role['description'] = 'Other description';
		expect(role.description).toBe('Other description');
	});

	test('getter and setter of is_active prop', () => {
		let role = new Role({ name: 'Vet', description: 'Some description' });
		expect(role.is_active).toBeTruthy();

		role = new Role({
			name: 'Customer',
			description: 'Some Desc',
			is_active: false,
		});
		expect(role.is_active).toBeFalsy();

		role = new Role({ name: 'Vet', description: 'Some description' });
		role['is_active'] = false;
		expect(role.is_active).toBeFalsy();
		role['is_active'] = undefined;
		expect(role.is_active).toBeTruthy();
		role['is_active'] = null;
		expect(role.is_active).toBeTruthy();
	});

	test('getter and setter of created_at prop', () => {
		let role = new Role({ name: 'Vet', description: 'Some description' });
		expect(role.created_at).toBeInstanceOf(Date);

		role = new Role({
			name: 'Customer',
			description: 'some desc',
			created_at: new Date(),
		});
		expect(role.created_at).toBeInstanceOf(Date);
	});
});

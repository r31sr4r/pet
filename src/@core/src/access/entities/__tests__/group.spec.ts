import { UniqueEntityId } from '#seedwork/domain';
import { omit } from 'lodash';
import { Group, GroupProperties } from '../group';
import { validate as uuidValidate } from 'uuid';


describe('Group Unit Tests', () => {
	beforeEach(() => {
		Group.validate = jest.fn();
	});

	test('constructor of Group', () => {
		let group = new Group({
			name: 'Some name',
			description: 'Some description',
			is_active: true,
		});
		let props = omit(group.props, ['created_at']);

		expect(Group.validate).toHaveBeenCalled();
		expect(props).toStrictEqual({
			name: 'Some name',
			description: 'Some description',
			is_active: true,
		});
		group = new Group({
			name: 'Some name',
			description: 'Some description',
			is_active: false,
		});
		props = omit(group.props, ['created_at']);

		expect(props).toStrictEqual({
			name: 'Some name',
			description: 'Some description',
			is_active: false,
		});
		let created_at = new Date();
		group = new Group({
			name: 'Some name',
			description: 'Some description',
			is_active: false,
			created_at,
		});
		expect(group.props).toStrictEqual({
			name: 'Some name',
			description: 'Some description',
			is_active: false,
			created_at,
		});
	});

	test('id field', () => {
		type GroupData = { props: GroupProperties; id?: UniqueEntityId };
		const data: GroupData[] = [
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
			const group = new Group(item.props, item.id);
			expect(group.id).not.toBeNull();
			expect(uuidValidate(group.id.toString())).toBeTruthy();
		});
	});

    test('getter of name prop', () => {
		const group = new Group({ name: 'Vet', description: 'Some description' });
		expect(group.name).toBe('Vet');
	});

	test('getter and setter of description prop', () => {
		let group = new Group({
			name: 'Customer',
			description: 'Some description',
		});
		expect(group.description).toBe('Some description');

		group = new Group({
			name: 'Veterinary',
			description: 'Description of veterinary',
		});
		expect(group.description).toBe('Description of veterinary');

		group['description'] = 'Other description';
		expect(group.description).toBe('Other description');
	});

	test('getter and setter of is_active prop', () => {
		let group = new Group({ name: 'Vet', description: 'Some description' });
		expect(group.is_active).toBeTruthy();

		group = new Group({
			name: 'Customer',
			description: 'Some Desc',
			is_active: false,
		});
		expect(group.is_active).toBeFalsy();

		group = new Group({ name: 'Vet', description: 'Some description' });
		group['is_active'] = false;
		expect(group.is_active).toBeFalsy();
		group['is_active'] = undefined;
		expect(group.is_active).toBeTruthy();
		group['is_active'] = null;
		expect(group.is_active).toBeTruthy();
	});

	test('getter and setter of created_at prop', () => {
		let group = new Group({ name: 'Vet', description: 'Some description' });
		expect(group.created_at).toBeInstanceOf(Date);

		group = new Group({
			name: 'Customer',
			description: 'some desc',
			created_at: new Date(),
		});
		expect(group.created_at).toBeInstanceOf(Date);
	});
});

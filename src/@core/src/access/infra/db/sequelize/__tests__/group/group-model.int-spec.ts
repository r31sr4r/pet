import { setupSequelize } from '#seedwork/infra/testing/helpers/db';
import { DataType } from 'sequelize-typescript';
import { GroupSequelize } from '../../group-sequelize';

const { GroupModel } = GroupSequelize;

describe('GroupModel Unit Tests', () => {
	setupSequelize({models: [GroupModel]});

	test('mapping props to columns', async () => {
		const attributesMap = GroupModel.getAttributes();
		const attributes = Object.keys(attributesMap);
		expect(attributes.length).toBe(5);
		expect(attributes).toStrictEqual([
			'id',
			'name',
			'description',
			'is_active',
			'created_at',
		]);

		const idAttr = attributesMap.id;
		expect(idAttr).toMatchObject({
			field: 'id',
			fieldName: 'id',
			primaryKey: true,
			type: DataType.UUID(),
		});

		const nameAttr = attributesMap.name;
		expect(nameAttr).toMatchObject({
			field: 'name',
			fieldName: 'name',
			allowNull: false,
			type: DataType.STRING(255),
		});

		const descriptionAttr = attributesMap.description;
		expect(descriptionAttr).toMatchObject({
			field: 'description',
			fieldName: 'description',
			allowNull: false,
			type: DataType.TEXT(),
		});

		const isActiveAttr = attributesMap.is_active;
		expect(isActiveAttr).toMatchObject({
			field: 'is_active',
			fieldName: 'is_active',
			allowNull: false,
			type: DataType.BOOLEAN(),
		});

		const createdAtAttr = attributesMap.created_at;
		expect(createdAtAttr).toMatchObject({
			field: 'created_at',
			fieldName: 'created_at',
			allowNull: false,
			type: DataType.DATE(),
		});		
	});

	it('should create a new group', async () => {
		const arrange = {
			id: '667b9345-0bcc-41bd-970d-0df043578a1c',
			name: 'Group 1',
			description: 'Description 1',
			is_active: true,
			created_at: new Date(),
		};

		const group = await GroupModel.create(arrange);

		expect(group).toBeDefined();
		expect(group.toJSON()).toStrictEqual(arrange);
	});
});

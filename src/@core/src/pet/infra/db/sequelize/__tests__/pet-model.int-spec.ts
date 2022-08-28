import { DataType } from 'sequelize-typescript';
import { setupSequelize } from '#seedwork/infra/testing/helpers/db';
import { PetSequelize } from '../pet-sequelize';
import { CustomerSequelize } from '#customer/infra';
import { Customer } from '#customer/domain';
import { UniqueEntityId } from '#seedwork/domain';

const { PetModel } = PetSequelize;

describe('PetModel Unit Tests', () => {
	setupSequelize({ models: [PetModel, CustomerSequelize.CustomerModel] });

	test('mapping props to columns', async () => {
		const attributesMap = PetModel.getAttributes();
		const attributes = Object.keys(attributesMap);
		expect(attributes.length).toBe(9);
		expect(attributes).toStrictEqual([
			'id',
			'name',
			'type',
			'breed',
			'gender',
			'birth_date',
			'is_active',
			'created_at',
			'customer_id',
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
			type: DataType.STRING(100),
		});

		const typeAttr = attributesMap.type;
		expect(typeAttr).toMatchObject({
			field: 'type',
			fieldName: 'type',
			allowNull: false,
			type: DataType.STRING(50),
		});

		const breedAttr = attributesMap.breed;
		expect(breedAttr).toMatchObject({
			field: 'breed',
			fieldName: 'breed',
			allowNull: true,
			type: DataType.STRING(50),
		});

		const genderAttr = attributesMap.gender;
		expect(genderAttr).toMatchObject({
			field: 'gender',
			fieldName: 'gender',
			allowNull: true,
			type: DataType.STRING(50),
		});

		const birthDateAttr = attributesMap.birth_date;
		expect(birthDateAttr).toMatchObject({
			field: 'birth_date',
			fieldName: 'birth_date',
			allowNull: true,
			type: DataType.DATE(),
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

		const customerIdAttr = attributesMap.customer_id;
		expect(customerIdAttr).toMatchObject({
			field: 'customer_id',
			fieldName: 'customer_id',
			allowNull: false,
			type: DataType.UUID(),
		});
	});

	it('should create a pet', async () => {
		const customer = new Customer(
			{
				name: 'John Doe',
				email: 'john@mail.com',
			},
			new UniqueEntityId('7f4e7cd3-88f0-466b-ad21-5e7b34c5ab02')
		);

		await CustomerSequelize.CustomerModel.create(customer.toJSON());

		const arrange = {
			id: '667b9345-0bcc-41bd-970d-0df043578a1c',
			name: 'Toto',
			type: 'dog',
			breed: 'labrador',
			gender: 'Male',
			birth_date: new Date('2021-04-03'),
			is_active: true,
			customer_id: '7f4e7cd3-88f0-466b-ad21-5e7b34c5ab02',
			created_at: new Date(),
		};

		const pet = await PetModel.create(arrange);

		expect(pet).toBeDefined();
		expect(pet.toJSON()).toStrictEqual(arrange);
	});

	it('search pet', async () => {
		await (await PetModel.factory()).create();
	});
});

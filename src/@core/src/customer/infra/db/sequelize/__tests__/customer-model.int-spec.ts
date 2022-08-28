
import { DataType } from 'sequelize-typescript';
import { setupSequelize } from '#seedwork/infra/testing/helpers/db';
import { CustomerSequelize } from '../customer-sequelize';

const { CustomerModel } = CustomerSequelize;

describe('CustomerModel Unit Tests', () => {
	setupSequelize({models: [CustomerModel]});

    test('mapping props to columns', async () => {
        const attributesMap = CustomerModel.getAttributes();
		const attributes = Object.keys(attributesMap);
		expect(attributes.length).toBe(8);
		expect(attributes).toStrictEqual([
			'id',
			'name',
			'type',
            'breed',
            'gender',
            'birth_date',
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


    });

    it('should create a customer', async () => {
        const arrange = {
            id: '667b9345-0bcc-41bd-970d-0df043578a1c',
            name: 'Toto',
            type: 'dog',
            breed: 'labrador',
            gender: 'Male',
            birth_date: new Date('2021-04-03'),
            is_active: true,
            created_at: new Date()
        }

		const customer = await CustomerModel.create(arrange);

		expect(customer).toBeDefined();
		expect(customer.toJSON()).toStrictEqual(arrange);
    });

	it('search customer', async () => {
		await CustomerModel.factory().create();

	});


});
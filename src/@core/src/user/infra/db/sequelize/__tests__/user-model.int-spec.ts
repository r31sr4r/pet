
import { DataType } from 'sequelize-typescript';
import { setupSequelize } from '#seedwork/infra/testing/helpers/db';
import { UserSequelize } from '../user-sequelize';

const { UserModel } = UserSequelize;

describe('UserModel Unit Tests', () => {
	setupSequelize({models: [UserModel]});

    test('mapping props to columns', async () => {
        const attributesMap = UserModel.getAttributes();
		const attributes = Object.keys(attributesMap);
		expect(attributes.length).toBe(6);
		expect(attributes).toStrictEqual([
			'id',
			'name',
			'email',
            'password',            
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

        const emailAttr = attributesMap.email;
        expect(emailAttr).toMatchObject({
            field: 'email',
            fieldName: 'email',
            allowNull: false,
            type: DataType.STRING(255),
        });

        const passwordAttr = attributesMap.password;
        expect(passwordAttr).toMatchObject({
            field: 'password',
            fieldName: 'password',
            allowNull: false,
            type: DataType.STRING(),
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

    it('should create a user', async () => {
        const arrange = {
            id: '667b9345-0bcc-41bd-970d-0df043578a1c',
            name: 'Toto',
            email: 'email@mail.com',
            password: 'Some password1',
            is_active: true,
            created_at: new Date()
        }

		const user = await UserModel.create(arrange);

		expect(user).toBeDefined();
		expect(user.toJSON()).toStrictEqual(arrange);
    });

	it('search user', async () => {
		await UserModel.factory().create();

	});


});
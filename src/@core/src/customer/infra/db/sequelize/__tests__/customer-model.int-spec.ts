
import { DataType } from 'sequelize-typescript';
import { setupSequelize } from '#seedwork/infra/testing/helpers/db';
import { CustomerSequelize } from '../customer-sequelize';
import { PetSequelize } from '#pet/infra';
import { Pet } from '#pet/domain';

const { CustomerModel } = CustomerSequelize;

describe('CustomerModel Unit Tests', () => {
	setupSequelize({models: [CustomerModel, PetSequelize.PetModel]});

    test('mapping props to columns', async () => {
        const attributesMap = CustomerModel.getAttributes();
		const attributes = Object.keys(attributesMap);
		expect(attributes.length).toBe(10);
		expect(attributes).toStrictEqual([
			'id',
			'name',
			'email',
            'cellphone',
            'cpf',
            'gender',
			'birth_date',
            'is_active',
			'created_at',
            'updated_at'
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

        const cellphoneAttr = attributesMap.cellphone;
        expect(cellphoneAttr).toMatchObject({
            field: 'cellphone',
            fieldName: 'cellphone',
            allowNull: true,
            type: DataType.STRING(15),
        });

        const cpfAttr = attributesMap.cpf;
        expect(cpfAttr).toMatchObject({
            field: 'cpf',
            fieldName: 'cpf',
            allowNull: true,
            type: DataType.STRING(11),
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

		const updatedAtAttr = attributesMap.updated_at;
		expect(updatedAtAttr).toMatchObject({
			field: 'updated_at',
			fieldName: 'updated_at',
			allowNull: true,
			type: DataType.DATE(),
		});	        
    });

    it('should create a customer', async () => {

        const arrange = {
            id: '667b9345-0bcc-41bd-970d-0df043578a1c',
            name: 'John Doe',
            email: 'john@mail.com',
            cellphone: '+55 (11) 99999-9999',
            cpf: '12345678901',            
            gender: 'Male',
            birth_date: new Date('2021-04-03'),
            is_active: true,
            created_at: new Date()
        }

		const customer = await CustomerModel.create(arrange);

		expect(customer).toBeDefined();
		expect(customer.toJSON()).toStrictEqual(arrange);
    });

    it('should create a customer with pet', async () => {

        const pet = new Pet({
            name: 'Toto',   
            type: 'Dog',
            customer_id: '667b9345-0bcc-41bd-970d-0df043578a1c'
        })

        const created_at = new Date();

        const arrange = {
            id: '667b9345-0bcc-41bd-970d-0df043578a1c',
            name: 'John Doe',
            email: 'john@mail.com',
            cellphone: '+55 (11) 99999-9999',
            cpf: '12345678901',            
            gender: 'Male',
            birth_date: new Date('2021-04-03'),
            pets: [pet],
            is_active: true,
            created_at
        }

		const customer = await CustomerModel.create(arrange);

		expect(customer).toBeDefined();
		expect(customer.toJSON()).toStrictEqual(
            {
                id: '667b9345-0bcc-41bd-970d-0df043578a1c',
                name: 'John Doe',
                email: 'john@mail.com',
                cellphone: '+55 (11) 99999-9999',
                cpf: '12345678901',            
                gender: 'Male',
                birth_date: new Date('2021-04-03'),
                is_active: true,
                created_at
            }
        );
    });


});
import { Pet, PetProperties } from './pet';
import { omit } from 'lodash';
import { validate as uuidValidate } from 'uuid'
import UniqueEntityId from '../../../@seedwork/domain/value-objects/unique-entity-id.vo';

describe('Pet Unit Tests', () => {
    test('constructor of Pet', () => {
        let pet = new Pet({ name: 'Tom', type: 'Cat' });
        let props = omit(pet.props, ['created_at', 'birth_date']);
        expect(props).toStrictEqual({
            name: 'Tom',
            type: 'Cat',
            breed: null,            
            is_active: true,                 
        })

        let created_at = new Date();
        pet = new Pet({ name: 'Tom', type: 'Cat', breed: 'Persian', created_at });
        expect(pet.props).toStrictEqual({
            name: 'Tom',
            type: 'Cat',
            breed: 'Persian',
            birth_date: null,
            is_active: true,
            created_at
        });

        let birth_date = new Date('2020-01-01');
        created_at = new Date();
        pet = new Pet({ name: 'Tom', type: 'Cat', is_active: false, birth_date, created_at});
        expect(pet.props).toStrictEqual({
            name: 'Tom',
            type: 'Cat',
            breed: null,
            birth_date,
            is_active: false,
            created_at
        });

        pet = new Pet({ name: 'Maul', type: 'Dog' });
        expect(pet.props).toMatchObject({
            name: 'Maul',
            type: 'Dog',
        });

        created_at = new Date();
        pet = new Pet({ name: 'Maul', type: 'Dog', created_at });
        expect(pet.props).toMatchObject({
            name: 'Maul',
            type: 'Dog',
            created_at
        });

    });

    test('id field', () => {
        type PetData = {props: PetProperties, id?: UniqueEntityId};
        const data: PetData[] = [
            { props: { name: 'Tom', type: 'Cat' } },
            { props: { name: 'Maul', type: 'Dog' }, id: null },
            { props: { name: 'Maul', type: 'Dog' }, id: undefined },
            { props: { name: 'Maul', type: 'Dog' }, id: new UniqueEntityId },
        ]

        data.forEach(item => {
            const pet = new Pet(item.props, item.id);
            expect(pet.id).not.toBeNull();
        });
    });

    test('getter of name prop', () => { 
        let pet = new Pet({ name: 'Tom', type: 'Cat' });
        expect(pet.name).toBe('Tom');
    });

    test('getter of type prop', () => {
        let pet = new Pet({ name: 'Tom', type: 'Cat' });
        expect(pet.type).toBe('Cat');
    });

    test('getter and setter of breed prop', () => {
        let pet = new Pet({ name: 'Tom', type: 'Cat' });
        expect(pet.breed).toBe(null);

        pet = new Pet({ name: 'Tom', type: 'Cat', breed: 'Persian' });
        expect(pet.breed).toBe('Persian');

        pet = new Pet({ name: 'Tom', type: 'Cat' });
        pet['breed'] = 'Persian';
        expect(pet.breed).toBe('Persian');
        pet['breed'] = undefined;
        expect(pet.breed).toBeNull();
        expect(pet.breed).toBeNull();

    });

    test('getter and setter of birth_date prop', () => {
        let pet = new Pet({ name: 'Tom', type: 'Cat' });
        expect(pet.birth_date).toBe(null);

        let birth_date = new Date('2020-01-01');
        pet = new Pet({ name: 'Tom', type: 'Cat', birth_date });
        expect(pet.birth_date).toBe(birth_date);

        birth_date = new Date('2021-03-01');
        pet = new Pet({ name: 'Tom', type: 'Cat' });
        pet['birth_date'] = birth_date;
        expect(pet.birth_date).toBe(birth_date);
        pet['birth_date'] = undefined;
        expect(pet.birth_date).toBeNull();
        pet['birth_date'] = null;
        expect(pet.birth_date).toBeNull();

    });

    test('getter and setter of is_active prop', () => {
        let pet = new Pet({ name: 'Tom', type: 'Cat' });
        expect(pet.is_active).toBeTruthy();

        pet = new Pet({ name: 'Tom', type: 'Cat', is_active: false });
        expect(pet.is_active).toBeFalsy();

        pet = new Pet({ name: 'Tom', type: 'Cat' });
        pet['is_active'] = false;
        expect(pet.is_active).toBeFalsy();
        pet['is_active'] = undefined;
        expect(pet.is_active).toBeTruthy();
        pet['is_active'] = null;
        expect(pet.is_active).toBeTruthy();

    });

    test('getter and setter of created_at prop', () => {
        let pet = new Pet({ name: 'Tom', type: 'Cat' });
        expect(pet.created_at).toBeInstanceOf(Date);

        pet = new Pet({ name: 'Tom', type: 'Cat', created_at: new Date() });
        expect(pet.created_at).toBeInstanceOf(Date);

    });


});
import { Pet } from "./pet";
import { omit } from "lodash";

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

        pet = new Pet({ name: 'Tom', type: 'Cat', breed: 'Persian' });
        let created_at = new Date();
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
        pet = new Pet({ name: 'Tom', type: 'Cat', is_active: false, birth_date});
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
});
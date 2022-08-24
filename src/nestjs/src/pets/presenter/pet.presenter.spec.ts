import { instanceToPlain } from "class-transformer";
import { PetPresenter } from "./pet.presenter";

describe('PetPresenter Unit Tests', () => {
    describe('constructor', () => {
        it('should set values', () => {
            const created_at = new Date();
            const birth_date = new Date('2021-01-03');
            const presenter = new PetPresenter({
                id: 'c1ae4284-b7d0-4f4f-b038-f3926a55cdfb',
                name: 'Pet 1',
                type: 'dog',
                breed: 'breed 1',
                gender: 'Male',
                birth_date,
                is_active: true,
                created_at,
            });

            expect(presenter.id).toBe('c1ae4284-b7d0-4f4f-b038-f3926a55cdfb');
            expect(presenter.name).toBe('Pet 1');
            expect(presenter.type).toBe('dog');
            expect(presenter.breed).toBe('breed 1');
            expect(presenter.gender).toBe('Male');            
            expect(presenter.is_active).toBe(true);
            expect(presenter.birth_date).toBe(birth_date);
            expect(presenter.created_at).toStrictEqual(created_at);
        });
    });

    it('should presenter data', () => {
        const created_at = new Date();
        const birth_date = new Date('2021-01-03');
        const presenter = new PetPresenter({
            id: 'c1ae4284-b7d0-4f4f-b038-f3926a55cdfb',
            name: 'Pet 1',
            type: 'dog',
            breed: 'breed 1',
            gender: 'Male',
            birth_date,
            is_active: true,
            created_at,
        });

        const data = instanceToPlain(presenter);
        expect(data).toStrictEqual({
            id: 'c1ae4284-b7d0-4f4f-b038-f3926a55cdfb',
            name: 'Pet 1',
            type: 'dog',
            breed: 'breed 1',
            gender: 'Male',
            birth_date,
            is_active: true,
            created_at: created_at.toISOString(),
        });
    });
});
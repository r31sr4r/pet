import { instanceToPlain } from 'class-transformer';
import { CustomerPresenter } from './customer.presenter';

describe('CustomerPresenter Unit Tests', () => {
    describe('constructor', () => {
        it('should set values', () => {
            const created_at = new Date();
            const birth_date = new Date();
            const presenter = new CustomerPresenter({
                id: 'c1ae4284-b7d0-4f4f-b038-f3926a55cdfb',
                name: 'Customer 1',
                email: 'user1@gmail.com',
                cellphone: '+55 (11) 99999-9999',
                cpf: '12345678900',
                gender: 'Male',
                birth_date,
                is_active: true,
                pets: [],
                created_at,
                updated_at: null,
            });

            expect(presenter.id).toBe('c1ae4284-b7d0-4f4f-b038-f3926a55cdfb');
            expect(presenter.name).toBe('Customer 1');
            expect(presenter.email).toBe('user1@gmail.com');
            expect(presenter.cellphone).toBe('+55 (11) 99999-9999');
            expect(presenter.cpf).toBe('12345678900');
            expect(presenter.gender).toBe('Male');
            expect(presenter.birth_date).toBe(birth_date);
            expect(presenter.is_active).toBe(true);
            expect(presenter.created_at).toStrictEqual(created_at);
            expect(presenter.updated_at).toBeNull();
        });
    });

    it('should presenter data', () => {
        const created_at = new Date();
        const birth_date = new Date();
        const presenter = new CustomerPresenter({
            id: 'c1ae4284-b7d0-4f4f-b038-f3926a55cdfb',
            name: 'Customer 1',
            email: 'user1@gmail.com',
            cellphone: '+55 (11) 99999-9999',
            cpf: '12345678900',
            gender: 'Female',
            birth_date,
            is_active: true,
            pets: [],
            created_at,
            updated_at: null
        });

        const data = instanceToPlain(presenter);

        expect(data).toStrictEqual({
            id: 'c1ae4284-b7d0-4f4f-b038-f3926a55cdfb',
            name: 'Customer 1',
            email: 'user1@gmail.com',
            cellphone: '+55 (11) 99999-9999',
            cpf: '12345678900',
            gender: 'Female',
            birth_date: birth_date.toISOString(),            
            is_active: true,
            created_at: created_at.toISOString(),
            updated_at: null
        });
    });
});

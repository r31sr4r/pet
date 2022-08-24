import { instanceToPlain } from "class-transformer";
import { UserPresenter } from "./user.presenter";

describe('UserPresenter Unit Tests', () => {
    describe('constructor', () => {
        it('should set values', () => {
            const created_at = new Date();
            const presenter = new UserPresenter({
                id: 'c1ae4284-b7d0-4f4f-b038-f3926a55cdfb',
                name: 'User 1',
                email: 'user1@gmail.com',
                password: 'Pass123456',
                is_active: true,
                created_at,
            });

            console.log(presenter);

            expect(presenter.id).toBe('c1ae4284-b7d0-4f4f-b038-f3926a55cdfb');
            expect(presenter.name).toBe('User 1');
            expect(presenter.email).toBe('user1@gmail.com');
            expect(presenter.password).toBeUndefined();
            expect(presenter.is_active).toBe(true);
            expect(presenter.created_at).toStrictEqual(created_at);
        });
    });

    it('should presenter data', () => {
        const created_at = new Date();
        const presenter = new UserPresenter({
            id: 'c1ae4284-b7d0-4f4f-b038-f3926a55cdfb',
            name: 'User 1',
            email: 'user1@gmail.com',
            password: 'Pass123456',
            is_active: true,
            created_at,
        });

        const data = instanceToPlain(presenter);
        expect(data).toStrictEqual({
            id: 'c1ae4284-b7d0-4f4f-b038-f3926a55cdfb',
            name: 'User 1',
            email: 'user1@gmail.com',
            is_active: true,
            created_at: created_at.toISOString(),
        });
    });
});
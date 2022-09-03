import { instanceToPlain } from "class-transformer";
import { RolePresenter } from "./role.presenter";

describe('RolePresenter Unit Tests', () => {
    describe('constructor', () => {
        it('should set values', () => {
            const created_at = new Date();
            const presenter = new RolePresenter({
                id: 'c1ae4284-b7d0-4f4f-b038-f3926a55cdfb',
                name: 'Role 1',
                description: 'Role 1 Description',                
                is_active: true,
                created_at,
            });

            expect(presenter.id).toBe('c1ae4284-b7d0-4f4f-b038-f3926a55cdfb');
            expect(presenter.name).toBe('Role 1');
            expect(presenter.description).toBe('Role 1 Description');            
            expect(presenter.is_active).toBe(true);
            expect(presenter.created_at).toStrictEqual(created_at);
        });
    });

    it('should presenter data', () => {
        const created_at = new Date();
        const presenter = new RolePresenter({
            id: 'c1ae4284-b7d0-4f4f-b038-f3926a55cdfb',
            name: 'Role 1',
            description: 'Role 1 Description',            
            is_active: true,
            created_at,
        });

        const data = instanceToPlain(presenter);
        expect(data).toStrictEqual({
            id: 'c1ae4284-b7d0-4f4f-b038-f3926a55cdfb',
            name: 'Role 1',
            description: 'Role 1 Description',     
            is_active: true,
            created_at: created_at.toISOString(),
        });
    });
});
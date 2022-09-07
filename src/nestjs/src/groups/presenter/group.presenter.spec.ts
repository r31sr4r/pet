import { instanceToPlain } from "class-transformer";
import { GroupPresenter } from "./group.presenter";

describe('GroupPresenter Unit Tests', () => {
    describe('constructor', () => {
        it('should set values', () => {
            const created_at = new Date();
            const presenter = new GroupPresenter({
                id: 'c1ae4284-b7d0-4f4f-b038-f3926a55cdfb',
                name: 'Group 1',
                description: 'Group 1 Description',                
                is_active: true,
                created_at,
            });

            expect(presenter.id).toBe('c1ae4284-b7d0-4f4f-b038-f3926a55cdfb');
            expect(presenter.name).toBe('Group 1');
            expect(presenter.description).toBe('Group 1 Description');            
            expect(presenter.is_active).toBe(true);
            expect(presenter.created_at).toStrictEqual(created_at);
        });
    });

    it('should presenter data', () => {
        const created_at = new Date();
        const presenter = new GroupPresenter({
            id: 'c1ae4284-b7d0-4f4f-b038-f3926a55cdfb',
            name: 'Group 1',
            description: 'Group 1 Description',            
            is_active: true,
            created_at,
        });

        const data = instanceToPlain(presenter);
        expect(data).toStrictEqual({
            id: 'c1ae4284-b7d0-4f4f-b038-f3926a55cdfb',
            name: 'Group 1',
            description: 'Group 1 Description',     
            is_active: true,
            created_at: created_at.toISOString(),
        });
    });
});
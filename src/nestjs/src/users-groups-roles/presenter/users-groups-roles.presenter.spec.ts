import { instanceToPlain } from "class-transformer";
import { UsersGroupsRolesPresenter } from "./users-groups-roles.presenter";

describe('UsersGroupsRolesPresenter Unit Tests', () => {
    describe('constructor', () => {
        it('should set values', () => {
            const created_at = new Date();
            const presenter = new UsersGroupsRolesPresenter({
                id: 'c1ae4284-b7d0-4f4f-b038-f3926a55cdfb',
                user_id: 'c1ae4284-b7d0-4f4f-b038-f3926a55cdfb',
                group_id: 'c1ae4284-b7d0-4f4f-b038-f3926a55cdfb',
                role_id: 'c1ae4284-b7d0-4f4f-b038-f3926a55cdfb',
                created_at,
            });

            expect(presenter.id).toBe('c1ae4284-b7d0-4f4f-b038-f3926a55cdfb');
            expect(presenter.user_id).toBe('c1ae4284-b7d0-4f4f-b038-f3926a55cdfb');
            expect(presenter.group_id).toBe('c1ae4284-b7d0-4f4f-b038-f3926a55cdfb');
            expect(presenter.role_id).toBe('c1ae4284-b7d0-4f4f-b038-f3926a55cdfb');
            expect(presenter.created_at).toStrictEqual(created_at);
        });
    });

    it('should presenter data', () => {
        const created_at = new Date();
        const presenter = new UsersGroupsRolesPresenter({
            id: 'c1ae4284-b7d0-4f4f-b038-f3926a55cdfb',
            user_id: 'c1ae4284-b7d0-4f4f-b038-f3926a55cdfb',
            group_id: 'c1ae4284-b7d0-4f4f-b038-f3926a55cdfb',
            role_id: 'c1ae4284-b7d0-4f4f-b038-f3926a55cdfb',
            created_at,
        });

        const data = instanceToPlain(presenter);
        expect(data).toStrictEqual({
            id: 'c1ae4284-b7d0-4f4f-b038-f3926a55cdfb',
            user_id: 'c1ae4284-b7d0-4f4f-b038-f3926a55cdfb',
            group_id: 'c1ae4284-b7d0-4f4f-b038-f3926a55cdfb',
            role_id: 'c1ae4284-b7d0-4f4f-b038-f3926a55cdfb',
            created_at: created_at.toISOString(),
        });
    });
});
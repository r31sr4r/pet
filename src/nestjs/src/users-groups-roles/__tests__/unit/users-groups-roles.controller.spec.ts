import { SortDirection } from 'pet-core/dist/@seedwork/domain/repository/repository-contracts';
import {
    CreateUserAssignedToGroupAndRoleUseCase,
    GetUserAssignedToGroupAndRoleUseCase,
    ListUserAssignedToGroupRoleUseCase,
} from 'pet-core/access/application';
import { CreateUsersGroupsRoleDto } from '../../dto/create-users-groups-role.dto';
import { UsersGroupsRolesController } from '../../users-groups-roles.controller';
import { UsersGroupsRolesPresenter } from '../../presenter/users-groups-roles.presenter';

describe('UsersGroupsRolesController', () => {
    let controller: UsersGroupsRolesController;

    beforeEach(async () => {
        controller = new UsersGroupsRolesController();
    });

    it('should create a UserAssignedToGroupAndRole', async () => {
        const output: CreateUserAssignedToGroupAndRoleUseCase.Output = {
            id: '3edaaad1-d538-4843-a6ef-9ebdaa69f10b',
            user_id: '875452ac-30b3-496a-922a-5f0afd2a8984',
            group_id: '98016e3e-92b9-4f86-a1c3-0f460f0548fb',
            role_id: '9e906588-f887-4476-9486-84d30ebdde29',
            created_at: new Date(),
        };

        const mockCreateUseCase = {
            execute: jest.fn().mockReturnValue(Promise.resolve(output)),
        };

        //@ts-expect-error
        controller['createUseCase'] = mockCreateUseCase;

        const input: CreateUsersGroupsRoleDto = {
            user_id: '875452ac-30b3-496a-922a-5f0afd2a8984',
            group_id: '98016e3e-92b9-4f86-a1c3-0f460f0548fb',
            role_id: '9e906588-f887-4476-9486-84d30ebdde29',
        };

        const presenter = await controller.create(input);
        expect(mockCreateUseCase.execute).toHaveBeenCalledWith(input);
        expect(presenter).toBeInstanceOf(UsersGroupsRolesPresenter);
        expect(presenter).toStrictEqual(new UsersGroupsRolesPresenter(output));
    });

    it('should delete a UserAssignedToGroupAndRole', async () => {
        const expectedOutput = undefined;
        const mockDeleteUseCase = {
            execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
        };

        //@ts-expect-error
        controller['deleteUseCase'] = mockDeleteUseCase;
        const id = '3edaaad1-d538-4843-a6ef-9ebdaa69f10b';
        expect(controller.remove(id)).toBeInstanceOf(Promise);

        const output = await controller.remove(id);
        expect(mockDeleteUseCase.execute).toHaveBeenCalledWith({ id });
        expect(expectedOutput).toStrictEqual(output);
    });

    it('should get a group', async () => {
        const id = '3edaaad1-d538-4843-a6ef-9ebdaa69f10b';
        const expectedOutput: GetUserAssignedToGroupAndRoleUseCase.Output = {
            id: id,
            user_id: '875452ac-30b3-496a-922a-5f0afd2a8984',
            group_id: '98016e3e-92b9-4f86-a1c3-0f460f0548fb',
            role_id: '9e906588-f887-4476-9486-84d30ebdde29',
            created_at: new Date(),
        };
        const mockGetUseCase = {
            execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
        };
        //@ts-expect-error
        controller['getUseCase'] = mockGetUseCase;
        const output = await controller.findOne(id);
        expect(mockGetUseCase.execute).toHaveBeenCalledWith({ id });
        expect(expectedOutput).toStrictEqual(output);
    });

    it('should search groups with filter', async () => {
        const expectdOutput: ListUserAssignedToGroupRoleUseCase.Output = {
            items: [
                {
                    id: '3edaaad1-d538-4843-a6ef-9ebdaa69f10b',
                    user_id: '875452ac-30b3-496a-922a-5f0afd2a8984',
                    group_id: '98016e3e-92b9-4f86-a1c3-0f460f0548fb',
                    role_id: '9e906588-f887-4476-9486-84d30ebdde29',
                    created_at: new Date(),
                },
            ],
            current_page: 1,
            last_page: 1,
            per_page: 10,
            total: 1,
        };

        const mockListUseCase = {
            execute: jest.fn().mockReturnValue(Promise.resolve(expectdOutput)),
        };
        //@ts-expect-error
        controller['listUseCase'] = mockListUseCase;

        const searchParams = {
            page: 1,
            per_page: 10,
            sort: 'name',
            sort_dir: 'asc' as SortDirection,            
        };

        const output = await controller.search(searchParams);

        expect(mockListUseCase.execute).toBeCalledWith(searchParams);
        expect(expectdOutput).toStrictEqual(output);
    });
});

import { SortDirection } from 'pet-core/dist/@seedwork/domain/repository/repository-contracts';
import {
    CreateRoleUseCase,
    GetRoleUseCase,
    ListRolesUseCase,
    UpdateRoleUseCase,
} from 'pet-core/access/application';
import { CreateRoleDto } from '../../dto/create-role.dto';
import { UpdateRoleDto } from '../../dto/update-role.dto';
import { RolesController } from '../../roles.controller';
import { RolePresenter } from '../../presenter/role.presenter';

describe('RolesController', () => {
    let controller: RolesController;

    beforeEach(async () => {
        controller = new RolesController();
    });

    it('should create a role', async () => {
        const output: CreateRoleUseCase.Output = {
            id: '3edaaad1-d538-4843-a6ef-9ebdaa69f10b',
            name: 'User',
            description: 'User Role',            
            is_active: true,
            created_at: new Date(),
        };

        const mockCreateUseCase = {
            execute: jest.fn().mockReturnValue(Promise.resolve(output)),
        };

        //@ts-expect-error
        controller['createUseCase'] = mockCreateUseCase;

        const input: CreateRoleDto = {
            name: 'Admin',
            description: 'Admin Role',            
            is_active: true,
        };

        const presenter = await controller.create(input);
        expect(mockCreateUseCase.execute).toHaveBeenCalledWith(input);
        expect(presenter).toBeInstanceOf(RolePresenter);
        expect(presenter).toStrictEqual(new RolePresenter(output));
    });

    it('shoult update a role', async () => {
        const expectedOutput: UpdateRoleUseCase.Output = {
            id: '3edaaad1-d538-4843-a6ef-9ebdaa69f10b',
            name: 'User',
            description: 'User Role',
            is_active: true,
            created_at: new Date(),
        };

        const mockUpdateUseCase = {
            execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
        };

        //@ts-expect-error
        controller['updateUseCase'] = mockUpdateUseCase;

        const input: UpdateRoleDto = {
            name: 'Admin',
            description: 'Admin Role',            
            is_active: true,
        };

        const output = await controller.update(
            '3edaaad1-d538-4843-a6ef-9ebdaa69f10b',
            input,
        );

        expect(mockUpdateUseCase.execute).toHaveBeenCalledWith({
            id: '3edaaad1-d538-4843-a6ef-9ebdaa69f10b',
            ...input,
        });
        expect(expectedOutput).toStrictEqual(output);
    });

    it('should delete a role', async () => {
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

    it('should get a role', async () => {
        const id = '3edaaad1-d538-4843-a6ef-9ebdaa69f10b';
        const expectedOutput: GetRoleUseCase.Output = {
            id: id,
            name: 'User',
            description: 'User Role',                       
            is_active: true,
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

    it('should search roles with filter', async () => {
        const expectdOutput: ListRolesUseCase.Output = {
            items: [
                {
                    id: '3edaaad1-d538-4843-a6ef-9ebdaa69f10b',
                    name: 'User',
                    description: 'User Role',
                    is_active: true,
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
            fiter: 'Paul',
        };

        const output = await controller.search(searchParams);

        expect(mockListUseCase.execute).toBeCalledWith(searchParams);
        expect(expectdOutput).toStrictEqual(output);
    });
});

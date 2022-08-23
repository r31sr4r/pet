import { SortDirection } from 'pet-core/dist/@seedwork/domain/repository/repository-contracts';
import {
    CreateUserUseCase,
    GetUserUseCase,
    ListUsersUseCase,
    UpdateUserUseCase,
} from 'pet-core/user/application';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { UsersController } from '../../users.controller';
import { UserPresenter } from '../../presenter/user.presenter';

describe('UsersController', () => {
    let controller: UsersController;

    beforeEach(async () => {
        controller = new UsersController();
    });

    it('should create a user', async () => {
        const output: CreateUserUseCase.Output = {
            id: '3edaaad1-d538-4843-a6ef-9ebdaa69f10b',
            name: 'Paul McCartney',
            email: 'paul@mail.com',
            password: 'Pass123456',
            is_active: true,
            created_at: new Date(),
        };

        const mockCreateUseCase = {
            execute: jest.fn().mockReturnValue(Promise.resolve(output)),
        };

        //@ts-expect-error
        controller['createUseCase'] = mockCreateUseCase;

        const input: CreateUserDto = {
            name: 'Paul McCartney',
            email: 'paul@mail.com',
            password: 'Pass123456',
            is_active: true,
        };

        const presenter = await controller.create(input);
        expect(mockCreateUseCase.execute).toHaveBeenCalledWith(input);
        expect(presenter).toBeInstanceOf(UserPresenter);
        expect(presenter).toStrictEqual(new UserPresenter(output));
    });

    it('shoult update a user', async () => {
        const expectedOutput: UpdateUserUseCase.Output = {
            id: '3edaaad1-d538-4843-a6ef-9ebdaa69f10b',
            name: 'Paul McCartney',
            email: 'paul@mail.com',
            password: 'Pass123456',
            is_active: true,
            created_at: new Date(),
        };

        const mockUpdateUseCase = {
            execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
        };

        //@ts-expect-error
        controller['updateUseCase'] = mockUpdateUseCase;

        const input: UpdateUserDto = {
            name: 'Paul McCartney',
            email: 'paul@mail.com',
            password: 'Pass123456',
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

    it('should delete a user', async () => {
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

    it('should get a pet', async () => {
        const id = '3edaaad1-d538-4843-a6ef-9ebdaa69f10b';
        const expectedOutput: GetUserUseCase.Output = {
            id: id,
            name: 'Paul McCartney',
            email: 'paul@mail.com',
            password: 'Pass123456',
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

    it('should search users with filter', async () => {
        const expectdOutput: ListUsersUseCase.Output = {
            items: [
                {
                    id: '3edaaad1-d538-4843-a6ef-9ebdaa69f10b',
                    name: 'Paul McCartney',
                    email: 'paul@mail.com',
                    password: 'Pass123456',
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

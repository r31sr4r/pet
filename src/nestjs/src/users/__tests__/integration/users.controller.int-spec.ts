import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../../users.controller';
import { UsersModule } from '../../users.module';
import { ConfigModule } from '../../../config/config.module';
import { DatabaseModule } from '../../../database/database.module';
import {
    CreateUserUseCase,
    DeleteUserUseCase,
    GetUserUseCase,
    ListUsersUseCase,
    UpdateUserUseCase,
} from 'pet-core/user/application';
import { UserRepository } from 'pet-core/user/domain';
import { USER_PROVIDERS } from '../../users.providers';

describe('UsersController Integration Tests', () => {
    let controller: UsersController;
    let repository: UserRepository.Repository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot(), DatabaseModule, UsersModule],
        }).compile();

        controller = module.get(UsersController);
        repository = module.get(
            USER_PROVIDERS.REPOSITORIES.USER_REPOSITORY.provide,
        );
    });

    it('should be defined', async () => {
        expect(controller).toBeDefined();
        expect(controller['createUseCase']).toBeInstanceOf(
            CreateUserUseCase.UseCase,
        );
        expect(controller['updateUseCase']).toBeInstanceOf(
            UpdateUserUseCase.UseCase,
        );
        expect(controller['deleteUseCase']).toBeInstanceOf(
            DeleteUserUseCase.UseCase,
        );
        expect(controller['listUseCase']).toBeInstanceOf(
            ListUsersUseCase.UseCase,
        );
        expect(controller['getUseCase']).toBeInstanceOf(GetUserUseCase.UseCase);
    });

    describe('should create a user', () => {
        const arrange = [
            {
                request: {
                    name: 'John Doe',
                    email: 'john2@mail.com',
                    password: 'Pass123456',
                },
                expectedPresenter: {
                    name: 'John Doe',
                    email: 'john2@mail.com',
                    is_active: true,
                },
            },
            // {
            //     request: {
            //         name: 'Movie',
            //         description: 'Movie category',
            //     },
            //     expectedPresenter: {
            //         name: 'Movie',
            //         description: 'Movie category',
            //         is_active: true,
            //     },
            // },
            // {
            //     request: {
            //         name: 'Movie',
            //         description: 'Movie category',
            //         is_active: false,
            //     },
            //     expectedPresenter: {
            //         name: 'Movie',
            //         description: 'Movie category',
            //         is_active: false,
            //     },
            // }
        ];

        test.each(arrange)(
            'with request $request',
            async ({ request, expectedPresenter }) => {
                const presenter = await controller.create(request);
                const entity = await repository.findById(presenter.id);

                expect(entity).toMatchObject({
                    id: presenter.id,
                    name: expectedPresenter.name,
                    email: expectedPresenter.email,
                    is_active: expectedPresenter.is_active,
                    created_at: presenter.created_at,
                });

                expect(presenter.id).toBe(entity.id);
                expect(presenter.name).toBe(expectedPresenter.name);
                expect(presenter.email).toBe(expectedPresenter.email);
                expect(presenter.is_active).toBe(expectedPresenter.is_active);
                expect(presenter.created_at).toStrictEqual(entity.created_at);
            },
        );
    });
});

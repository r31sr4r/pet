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
import {
    Group,
    GroupRepository,
    Role,
    RoleRepository,
} from 'pet-core/access/domain';
import { GroupsModule } from '../../../groups/groups.module';
import { GROUP_PROVIDERS } from '../../../groups/groups.providers';
import { UniqueEntityId } from 'pet-core/@seedwork/domain';
import { RolesModule } from '../../../roles/roles.module';
import { ROLE_PROVIDERS } from '../../../roles/roles.providers';

describe('UsersController Integration Tests', () => {
    let controller: UsersController;
    let repository: UserRepository.Repository;
    let groupRepository: GroupRepository.Repository;
    let roleRepository: RoleRepository.Repository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot(),
                DatabaseModule,
                UsersModule,
                GroupsModule,
                RolesModule,
            ],
        }).compile();

        controller = module.get(UsersController);
        repository = module.get(
            USER_PROVIDERS.REPOSITORIES.USER_REPOSITORY.provide,
        );
        groupRepository = module.get(
            GROUP_PROVIDERS.REPOSITORIES.GROUP_REPOSITORY.provide,
        );
        roleRepository = module.get(
            ROLE_PROVIDERS.REPOSITORIES.ROLE_REPOSITORY.provide,
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

    it('should create a user', async () => {
        const group = new Group(
            {
                name: 'customer',
                description: 'customer description',
            },
            new UniqueEntityId('7ffe665d-2239-4287-83f9-99b1b0592376'),
        );

        await groupRepository.insert(group);
        const createdGroup = await groupRepository.findById(
            '7ffe665d-2239-4287-83f9-99b1b0592376',
        );

        const role = new Role(
            {
                name: 'user',
                description: 'user role description',
            },
            new UniqueEntityId('0f8613ce-e9f8-46d1-a0d9-3b707bc48bb5'),
        );

        await roleRepository.insert(role);
        const createdRole = await roleRepository.findById(
            '0f8613ce-e9f8-46d1-a0d9-3b707bc48bb5',
        );

        const arrange = [
            {
                request: {
                    name: 'John Doe',
                    email: 'john2@mail.com',
                    password: 'Pass123456',
                    group: createdGroup.name,
                    role: createdRole.name,
                },
                expectedPresenter: {
                    name: 'John Doe',
                    email: 'john2@mail.com',
                    is_active: true,
                },
            },
            {
                request: {
                    name: 'Paul Doe',
                    email: 'paul2@mail.com',
                    password: 'Pass123456',
                    group: createdGroup.name,
                    role: createdRole.name,
                },
                expectedPresenter: {
                    name: 'Paul Doe',
                    email: 'paul2@mail.com',
                    is_active: true,
                },
            },
            {
                request: {
                    name: 'Ringo Doe',
                    email: 'ringo@mail.com',
                    password: 'Pass123456',
                    is_active: false,
                    group: createdGroup.name,
                    role: createdRole.name,
                },
                expectedPresenter: {
                    name: 'Ringo Doe',
                    email: 'ringo@mail.com',
                    is_active: false,
                },
            }
        ];

        arrange.forEach(async (item) => {
            const presenter = await controller.create(item.request);
            const entity = await repository.findById(presenter.id);            

            expect(presenter.id).toBe(entity.id);
            expect(presenter.name).toBe(item.expectedPresenter.name);
            expect(presenter.email).toBe(item.expectedPresenter.email);
            expect(presenter.is_active).toBe(item.expectedPresenter.is_active);
            expect(presenter.created_at).toStrictEqual(entity.created_at);
        });
    });
});

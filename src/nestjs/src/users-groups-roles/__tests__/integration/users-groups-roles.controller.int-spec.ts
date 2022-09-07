import { Test, TestingModule } from '@nestjs/testing';
import { UsersGroupsRolesController } from '../../users-groups-roles.controller';
import { UsersGroupsRolesModule } from '../../users-groups-roles.module';
import { ConfigModule } from '../../../config/config.module';
import { DatabaseModule } from '../../../database/database.module';
import {
    CreateUserAssignedToGroupAndRoleUseCase,
    DeleteUserAssignedToGroupAndRoleUseCase,
    GetUserAssignedToGroupAndRoleUseCase,
    ListUserAssignedToGroupRoleUseCase,
} from 'pet-core/access/application';
import {
    Group,
    GroupRepository,
    Role,
    RoleRepository,
    UserAssignedToGroupAndRoleRepository,
} from 'pet-core/access/domain';
import { USERS_GROUPS_ROLES_PROVIDERS } from '../../users-groups-roles.providers';
import { GroupsModule } from '../../../groups/groups.module';
import { RolesModule } from '../../../roles/roles.module';
import { USER_PROVIDERS } from '../../../users/users.providers';
import { GROUP_PROVIDERS } from '../../../groups/groups.providers';
import { ROLE_PROVIDERS } from '../../../roles/roles.providers';
import { User, UserRepository } from 'pet-core/user/domain';
import { UniqueEntityId } from 'pet-core/@seedwork/domain';

describe('UsersGroupsRolesController Integration Tests', () => {
    let controller: UsersGroupsRolesController;
    let repository: UserAssignedToGroupAndRoleRepository.Repository;
    let userRepository: UserRepository.Repository;
    let groupRepository: GroupRepository.Repository;
    let roleRepository: RoleRepository.Repository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot(),
                DatabaseModule,
                UsersGroupsRolesModule,
                GroupsModule,
                RolesModule,
            ],
        }).compile();

        controller = module.get(UsersGroupsRolesController);
        repository = module.get(
            USERS_GROUPS_ROLES_PROVIDERS.REPOSITORIES
                .USERS_GROUPS_ROLES_REPOSITORY.provide,
        );
        userRepository = module.get(
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
            CreateUserAssignedToGroupAndRoleUseCase.UseCase,
        );
        expect(controller['deleteUseCase']).toBeInstanceOf(
            DeleteUserAssignedToGroupAndRoleUseCase.UseCase,
        );
        expect(controller['listUseCase']).toBeInstanceOf(
            ListUserAssignedToGroupRoleUseCase.UseCase,
        );
        expect(controller['getUseCase']).toBeInstanceOf(
            GetUserAssignedToGroupAndRoleUseCase.UseCase,
        );
    });

    it('should create a UserAssignedToGroupAndRole', async () => {
        const user = new User(
            {
                name: 'test',
                email: 'test@mai.com',
                password: '123456Tes@',
            },
            new UniqueEntityId('5e7d46b4-23f3-4d97-9be3-73f96ffaa92a'),
        );

        await userRepository.insert(user);
        const createdUser = await userRepository.findById(user.id);

        const group = new Group({
            name: 'customer',
            description: 'customer description',
        });

        await groupRepository.insert(group);
        const createdGroup = await groupRepository.findById(group.id);

        const role = new Role({
            name: 'user',
            description: 'user role description',
        });

        await roleRepository.insert(role);
        const createdRole = await roleRepository.findById(role.id);

        const arrange = [
            {
                request: {
                    user_id: createdUser.id,
                    group_id: createdGroup.id,
                    role_id: createdRole.id,
                },
                expectedPresenter: {
                    user_id: createdUser.id,
                    group_id: createdGroup.id,
                    role_id: createdRole.id,
                },
            },
        ];

        arrange.forEach(async (item) => {
            const presenter = await controller.create(item.request);
            const entity = await repository.findById(presenter.id);

            expect(presenter.id).toBe(entity.id);
            expect(presenter.user_id).toBe(item.expectedPresenter.user_id);
            expect(presenter.group_id).toBe(item.expectedPresenter.group_id);
            expect(presenter.role_id).toBe(item.expectedPresenter.role_id);
            expect(presenter.created_at).toStrictEqual(entity.created_at);
        });
    });
});

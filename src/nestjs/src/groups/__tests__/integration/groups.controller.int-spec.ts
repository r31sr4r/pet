import { Test, TestingModule } from '@nestjs/testing';
import { GroupsController } from '../../groups.controller';
import { GroupsModule } from '../../groups.module';
import { ConfigModule } from '../../../config/config.module';
import { DatabaseModule } from '../../../database/database.module';
import {
    CreateGroupUseCase,
    DeleteGroupUseCase,
    GetGroupUseCase,
    ListGroupsUseCase,
    UpdateGroupUseCase,
} from 'pet-core/access/application';
import { GroupRepository } from 'pet-core/access/domain';
import { GROUP_PROVIDERS } from '../../groups.providers';

describe('GroupsController Integration Tests', () => {
    let controller: GroupsController;
    let repository: GroupRepository.Repository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot(), DatabaseModule, GroupsModule],
        }).compile();

        controller = module.get(GroupsController);
        repository = module.get(
            GROUP_PROVIDERS.REPOSITORIES.GROUP_REPOSITORY.provide,
        );
    });

    it('should be defined', async () => {
        expect(controller).toBeDefined();
        expect(controller['createUseCase']).toBeInstanceOf(
            CreateGroupUseCase.UseCase,
        );
        expect(controller['updateUseCase']).toBeInstanceOf(
            UpdateGroupUseCase.UseCase,
        );
        expect(controller['deleteUseCase']).toBeInstanceOf(
            DeleteGroupUseCase.UseCase,
        );
        expect(controller['listUseCase']).toBeInstanceOf(
            ListGroupsUseCase.UseCase,
        );
        expect(controller['getUseCase']).toBeInstanceOf(GetGroupUseCase.UseCase);
    });

    describe('should create a group', () => {
        const arrange = [
            {
                request: {
                    name: 'User',
                    description: 'User Group',                    
                },
                expectedPresenter: {
                    name: 'User',
                    description: 'User Group',   
                    is_active: true,
                },
            },
            {
                request: {
                    name: 'Admin',
                    description: 'Admin Group',                    
                },
                expectedPresenter: {
                    name: 'Admin',
                    description: 'Admin Group',  
                    is_active: true,
                },
            },
            {
                request: {
                    name: 'Editor',
                    description: 'Editor Group',
                    is_active: false,
                },
                expectedPresenter: {
                    name: 'Editor',
                    description: 'Editor Group',
                    is_active: false,
                },
            }
        ];

        test.each(arrange)(
            'with request $request',
            async ({ request, expectedPresenter }) => {
                const presenter = await controller.create(request);
                const entity = await repository.findById(presenter.id);

                expect(entity).toMatchObject({
                    id: presenter.id,
                    name: expectedPresenter.name,
                    description: expectedPresenter.description,
                    is_active: expectedPresenter.is_active,
                    created_at: presenter.created_at,
                });

                expect(presenter.id).toBe(entity.id);
                expect(presenter.name).toBe(expectedPresenter.name);                
                expect(presenter.description).toBe(expectedPresenter.description);
                expect(presenter.is_active).toBe(expectedPresenter.is_active);
                expect(presenter.created_at).toStrictEqual(entity.created_at);
            },
        );
    });
});

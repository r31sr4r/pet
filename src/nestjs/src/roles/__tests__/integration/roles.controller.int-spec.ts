import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from '../../roles.controller';
import { RolesModule } from '../../roles.module';
import { ConfigModule } from '../../../config/config.module';
import { DatabaseModule } from '../../../database/database.module';
import {
    CreateRoleUseCase,
    DeleteRoleUseCase,
    GetRoleUseCase,
    ListRolesUseCase,
    UpdateRoleUseCase,
} from 'pet-core/access/application';
import { RoleRepository } from 'pet-core/access/domain';
import { ROLE_PROVIDERS } from '../../roles.providers';

describe('RolesController Integration Tests', () => {
    let controller: RolesController;
    let repository: RoleRepository.Repository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot(), DatabaseModule, RolesModule],
        }).compile();

        controller = module.get(RolesController);
        repository = module.get(
            ROLE_PROVIDERS.REPOSITORIES.ROLE_REPOSITORY.provide,
        );
    });

    it('should be defined', async () => {
        expect(controller).toBeDefined();
        expect(controller['createUseCase']).toBeInstanceOf(
            CreateRoleUseCase.UseCase,
        );
        expect(controller['updateUseCase']).toBeInstanceOf(
            UpdateRoleUseCase.UseCase,
        );
        expect(controller['deleteUseCase']).toBeInstanceOf(
            DeleteRoleUseCase.UseCase,
        );
        expect(controller['listUseCase']).toBeInstanceOf(
            ListRolesUseCase.UseCase,
        );
        expect(controller['getUseCase']).toBeInstanceOf(GetRoleUseCase.UseCase);
    });

    describe('should create a role', () => {
        const arrange = [
            {
                request: {
                    name: 'User',
                    description: 'User Role',                    
                },
                expectedPresenter: {
                    name: 'User',
                    description: 'User Role',   
                    is_active: true,
                },
            },
            {
                request: {
                    name: 'Admin',
                    description: 'Admin Role',                    
                },
                expectedPresenter: {
                    name: 'Admin',
                    description: 'Admin Role',  
                    is_active: true,
                },
            },
            {
                request: {
                    name: 'Editor',
                    description: 'Editor Role',
                    is_active: false,
                },
                expectedPresenter: {
                    name: 'Editor',
                    description: 'Editor Role',
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

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

describe('UsersController Integration Tests', () => {
    let controller: UsersController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot(), DatabaseModule, UsersModule],
        }).compile();

        controller = module.get(UsersController);
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
});

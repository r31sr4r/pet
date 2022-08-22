import { Test, TestingModule } from '@nestjs/testing';
import { PetsController } from '../../pets.controller';
import { PetsModule } from '../../pets.module';
import { ConfigModule } from '../../../config/config.module';
import { DatabaseModule } from '../../../database/database.module';
import {
    CreatePetUseCase,
    DeletePetUseCase,
    GetPetUseCase,
    ListPetsUseCase,
    UpdatePetUseCase,
} from 'pet-core/pet/application';

describe('PetsController Integration Tests', () => {
    let controller: PetsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot(), DatabaseModule, PetsModule],
        }).compile();

    controller = module.get(PetsController);

    });

    it('should be defined', async () => {
        expect(controller).toBeDefined();
        expect(controller['createUseCase']).toBeInstanceOf(
            CreatePetUseCase.UseCase,
        );
        expect(controller['updateUseCase']).toBeInstanceOf(
            UpdatePetUseCase.UseCase,
        );
        expect(controller['deleteUseCase']).toBeInstanceOf(
            DeletePetUseCase.UseCase,
        );
        expect(controller['listUseCase']).toBeInstanceOf(
            ListPetsUseCase.UseCase,  
        );
        expect(controller['getUseCase']).toBeInstanceOf(
            GetPetUseCase.UseCase,
        );
    });

});

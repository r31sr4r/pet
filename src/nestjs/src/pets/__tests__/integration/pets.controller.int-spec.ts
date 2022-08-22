import { Test, TestingModule } from '@nestjs/testing';
import { PetsController } from '../../pets.controller';
import { PetsModule } from '../../pets.module';
import { ConfigModule } from '../../../config/config.module';
import { DatabaseModule } from '../../../database/database.module';

describe('PetsController Integration Tests', () => {
    let controller: PetsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot(), DatabaseModule, PetsModule],
        }).compile();

    controller = module.get(PetsController);

    });

    it('xpto', async () => {
        console.log(controller);
        expect(true).toBe(true);
    });

});

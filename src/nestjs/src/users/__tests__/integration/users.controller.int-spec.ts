import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../../users.controller';
import { UsersModule } from '../../users.module';
import { ConfigModule } from '../../../config/config.module';
import { DatabaseModule } from '../../../database/database.module';

describe('UsersController Integration Tests', () => {
    let controller: UsersController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot(), DatabaseModule, UsersModule],
        }).compile();

    controller = module.get(UsersController);

    });

    it('xpto', async () => {
        console.log(controller);
        expect(true).toBe(true);
    });

});

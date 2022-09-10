import { Module } from '@nestjs/common';
import { PetsService } from './pets.service';
import { PetsController } from './pets.controller';
import { PET_PROVIDERS } from './pets.providers';
import { SequelizeModule } from '@nestjs/sequelize';
import { PetSequelize } from 'pet-core/pet/infra';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [SequelizeModule.forFeature([PetSequelize.PetModel]), UsersModule],
    controllers: [PetsController],
    providers: [
        PetsService,
        ...Object.values(PET_PROVIDERS.REPOSITORIES),
        ...Object.values(PET_PROVIDERS.USE_CASES),
    ],
})
export class PetsModule {}

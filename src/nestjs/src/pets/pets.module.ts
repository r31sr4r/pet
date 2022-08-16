import { Module } from '@nestjs/common';
import { PetsService } from './pets.service';
import { PetsController } from './pets.controller';
import { PET_PROVIDERS } from './pets.providers';

@Module({
    controllers: [PetsController],
    providers: [
        PetsService,
        ...Object.values(PET_PROVIDERS.REPOSITORIES),
        ...Object.values(PET_PROVIDERS.USE_CASES)       
        
    ],
})
export class PetsModule {}

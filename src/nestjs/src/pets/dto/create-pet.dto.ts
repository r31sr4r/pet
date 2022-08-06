import { CreatePetUseCase } from 'pet-core/pet/application';

export class CreatePetDto implements CreatePetUseCase.Input {
    name: string;
    type: string;
    breed?: string;
    gender?: string;
    birth_date?: Date;
    is_active?: boolean;
}

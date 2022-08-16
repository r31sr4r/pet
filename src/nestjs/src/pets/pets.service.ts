
import { Inject, Injectable } from '@nestjs/common';
import { CreatePetUseCase, ListPetsUseCase } from 'pet-core/pet/application';
import { UpdatePetDto } from './dto/update-pet.dto';

@Injectable()
export class PetsService {
    @Inject(CreatePetUseCase.UseCase)
    private createUseCase: CreatePetUseCase.UseCase;

    @Inject(ListPetsUseCase.UseCase)
    private listUseCase: ListPetsUseCase.UseCase;

    create(createPetDto: CreatePetUseCase.Input) {
        return this.createUseCase.execute(createPetDto);
    }

    search(input: ListPetsUseCase.Input) {
        return this.listUseCase.execute(input);
    }

    findOne(id: number) {
        return `This action returns a #${id} pet`;
    }

    update(id: number, updatePetDto: UpdatePetDto) {
        return `This action updates a #${id} pet`;
    }

    remove(id: number) {
        return `This action removes a #${id} pet`;
    }
}

import {
    CreatePetUseCase,
    DeletePetUseCase,
    GetPetUseCase,
    ListPetsUseCase,
    UpdatePetUseCase,
} from 'pet-core/pet/application';
import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Inject,
    Put,
    HttpCode,
    Query,
} from '@nestjs/common';
import { CreatePetDto } from './dto/create-pet.dto';
import { SearchPetDto } from './dto/search-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { PetPresenter } from './presenter/pet.presenter';


@Controller('pets')
export class PetsController {
    @Inject(CreatePetUseCase.UseCase)
    private createUseCase: CreatePetUseCase.UseCase;

    @Inject(UpdatePetUseCase.UseCase)
    private updateUseCase: UpdatePetUseCase.UseCase;

    @Inject(DeletePetUseCase.UseCase)
    private deleteUseCase: DeletePetUseCase.UseCase;

    @Inject(GetPetUseCase.UseCase)
    private getUseCase: GetPetUseCase.UseCase;

    @Inject(ListPetsUseCase.UseCase)
    private listUseCase: ListPetsUseCase.UseCase;

    @Post()
    async create(@Body() createPetDto: CreatePetDto) {        
        const output = await this.createUseCase.execute(createPetDto);
        return new PetPresenter(output);        
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updatePetDto: UpdatePetDto) {
        return this.updateUseCase.execute({
            id,
            ...updatePetDto,
        });
    }

    @HttpCode(204)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.deleteUseCase.execute({ id });
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.getUseCase.execute({ id });
    }

    @Get()
    search(@Query() searchParams: SearchPetDto) {
        return this.listUseCase.execute(searchParams);
    }
}

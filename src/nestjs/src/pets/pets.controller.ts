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
    UseGuards,
} from '@nestjs/common';
import { CreatePetDto } from './dto/create-pet.dto';
import { SearchPetDto } from './dto/search-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { PetPresenter } from './presenter/pet.presenter';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@Controller('pets')
@ApiTags('Pets')
@ApiBearerAuth()
@UseGuards(AuthGuard())
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
    @ApiOperation({ summary: 'Create a new pet', description: 'Create a new pet' })    
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
    @ApiOperation({ summary: 'View all pets', description: 'Get all pets or filter by name' })
    search(@Query() searchParams: SearchPetDto) {
        return this.listUseCase.execute(searchParams);
    }
}

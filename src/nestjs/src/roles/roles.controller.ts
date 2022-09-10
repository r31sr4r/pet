import {
    CreateRoleUseCase,
    DeleteRoleUseCase,
    GetRoleUseCase,
    ListRolesUseCase,
    UpdateRoleUseCase,
} from 'pet-core/access/application';
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
import { SearchRoleDto } from './dto/search-role.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolePresenter } from './presenter/role.presenter';
import { AuthGuard } from '@nestjs/passport';

@Controller('roles')
@UseGuards(AuthGuard())
export class RolesController {
    @Inject(CreateRoleUseCase.UseCase)
    private createUseCase: CreateRoleUseCase.UseCase;

    @Inject(UpdateRoleUseCase.UseCase)
    private updateUseCase: UpdateRoleUseCase.UseCase;

    @Inject(DeleteRoleUseCase.UseCase)
    private deleteUseCase: DeleteRoleUseCase.UseCase;

    @Inject(GetRoleUseCase.UseCase)
    private getUseCase: GetRoleUseCase.UseCase;

    @Inject(ListRolesUseCase.UseCase)
    private listUseCase: ListRolesUseCase.UseCase;

    @Post()
    async create(@Body() createRoleDto: CreateRoleDto) {
        const output = await this.createUseCase.execute(createRoleDto);
        return new RolePresenter(output);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
        return this.updateUseCase.execute({
            id,
            ...updateRoleDto,
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
    search(@Query() searchParams: SearchRoleDto) {
        return this.listUseCase.execute(searchParams);
    }
}

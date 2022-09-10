import {
    CreateUserAssignedToGroupAndRoleUseCase,
    DeleteUserAssignedToGroupAndRoleUseCase,
    GetUserAssignedToGroupAndRoleUseCase,
    ListUserAssignedToGroupRoleUseCase,
} from 'pet-core/access/application';
import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Inject,    
    HttpCode,
    Query,
    UseGuards,
} from '@nestjs/common';
import { SearchUsersGroupsRoleDto } from './dto/search-users-groups-role.dto';
import { CreateUsersGroupsRoleDto } from './dto/create-users-groups-role.dto';
import { UsersGroupsRolesPresenter } from './presenter/users-groups-roles.presenter';
import { AuthGuard } from '@nestjs/passport';

@Controller('users-groups-roles')
@UseGuards(AuthGuard())
export class UsersGroupsRolesController {
    @Inject(CreateUserAssignedToGroupAndRoleUseCase.UseCase)
    private createUseCase: CreateUserAssignedToGroupAndRoleUseCase.UseCase;

    @Inject(DeleteUserAssignedToGroupAndRoleUseCase.UseCase)
    private deleteUseCase: DeleteUserAssignedToGroupAndRoleUseCase.UseCase;

    @Inject(GetUserAssignedToGroupAndRoleUseCase.UseCase)
    private getUseCase: GetUserAssignedToGroupAndRoleUseCase.UseCase;

    @Inject(ListUserAssignedToGroupRoleUseCase.UseCase)
    private listUseCase: ListUserAssignedToGroupRoleUseCase.UseCase;

    @Post()
    async create(@Body() createUsersGroupsRoleDto: CreateUsersGroupsRoleDto) {
        const output = await this.createUseCase.execute(
            createUsersGroupsRoleDto,
        );
        return new UsersGroupsRolesPresenter(output);
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
    search(@Query() searchParams: SearchUsersGroupsRoleDto) {
        return this.listUseCase.execute(searchParams);
    }
}

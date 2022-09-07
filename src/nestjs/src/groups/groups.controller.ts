import {
  CreateGroupUseCase,
  DeleteGroupUseCase,
  GetGroupUseCase,
  ListGroupsUseCase,
  UpdateGroupUseCase,
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
} from '@nestjs/common';
import { SearchGroupDto } from './dto/search-group.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupPresenter } from './presenter/group.presenter';

@Controller('groups')
export class GroupsController {
  @Inject(CreateGroupUseCase.UseCase)
  private createUseCase: CreateGroupUseCase.UseCase;

  @Inject(UpdateGroupUseCase.UseCase)
  private updateUseCase: UpdateGroupUseCase.UseCase;

  @Inject(DeleteGroupUseCase.UseCase)
  private deleteUseCase: DeleteGroupUseCase.UseCase;

  @Inject(GetGroupUseCase.UseCase)
  private getUseCase: GetGroupUseCase.UseCase;

  @Inject(ListGroupsUseCase.UseCase)
  private listUseCase: ListGroupsUseCase.UseCase;

  @Post()
  async create(@Body() createGroupDto: CreateGroupDto) {
      const output = await this.createUseCase.execute(createGroupDto);
      return new GroupPresenter(output);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
      return this.updateUseCase.execute({
          id,
          ...updateGroupDto,
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
  search(@Query() searchParams: SearchGroupDto) {
      return this.listUseCase.execute(searchParams);
  }
}

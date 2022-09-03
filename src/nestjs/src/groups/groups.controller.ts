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
  Param,
  Inject,
  Query,
} from '@nestjs/common';
import { SearchGroupDto } from './dto/search-group.dto';

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

  @Get(':id')
  findOne(@Param('id') id: string) {
      return this.getUseCase.execute({ id });
  }

  @Get()
  search(@Query() searchParams: SearchGroupDto) {
      return this.listUseCase.execute(searchParams);
  }
}

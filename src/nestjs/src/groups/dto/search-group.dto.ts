import { ListGroupsUseCase } from 'pet-core/access/application';
import { SortDirection } from 'pet-core/dist/@seedwork/domain/repository/repository-contracts';

export class SearchGroupDto implements ListGroupsUseCase.Input {
    page?: number;
    per_page?: number;
    sort?: string;
    sort_dir?: SortDirection;
    filter?: string;
}

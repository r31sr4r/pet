import { ListUsersUseCase } from 'pet-core/user/application';
import { SortDirection } from 'pet-core/dist/@seedwork/domain/repository/repository-contracts';

export class SearchUserDto implements ListUsersUseCase.Input {
    page?: number;
    per_page?: number;
    sort?: string;
    sort_dir?: SortDirection;
    filter?: string;
}

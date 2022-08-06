import { ListPetsUseCase } from 'pet-core/category/application';
import { SortDirection } from 'pet-core/dist/@seedwork/domain/repository/repository-contracts';

export class SearchPetDto implements ListPetsUseCase.Input {
    page?: number;
    per_page?: number;
    sort?: string;
    sort_dir?: SortDirection;
    filter?: string;
}

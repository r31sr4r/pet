import { ListCustomersUseCase } from 'pet-core/customer/application';
import { SortDirection } from 'pet-core/dist/@seedwork/domain/repository/repository-contracts';

export class SearchCustomerDto implements ListCustomersUseCase.Input {
    page?: number;
    per_page?: number;
    sort?: string;
    sort_dir?: SortDirection;
    filter?: string;
}

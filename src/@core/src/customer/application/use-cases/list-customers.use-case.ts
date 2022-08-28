import {
	PaginationOutputDto,
	PaginationOutputMapper,
} from '../../../@seedwork/application/dto/pagination-output';
import { SearchInputDto } from '../../../@seedwork/application/dto/search-input';
import { default as DefaultUseCase } from '../../../@seedwork/application/use-case';
import { CustomerRepository } from '../../domain/repository/customer.repository';
import { CustomerOutput, CustomerOutputMapper } from '../dto/customer-output';

export namespace ListCustomersUseCase {
	export class UseCase implements DefaultUseCase<Input, Output> {
		constructor(private customerRepo: CustomerRepository.Repository) {}

		async execute(input: Input): Promise<Output> {
			const params = new CustomerRepository.SearchParams(input);
			const searchResult = await this.customerRepo.search(params);

			return this.toOutput(searchResult);
		}

		private toOutput(
			searchResult: CustomerRepository.SearchResult
		): Output {
			return {
				items: searchResult.items.map((i) =>
					CustomerOutputMapper.toOutput(i)
				),
				...PaginationOutputMapper.toOutput(searchResult),
			};
		}
	}

	export type Input = SearchInputDto;

	export type Output = PaginationOutputDto<CustomerOutput>;
}

export default ListCustomersUseCase;

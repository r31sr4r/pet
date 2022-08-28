import {
	SearchableRepositoryInterface,
	SearchParams as DefaultSearchParams,
	SearchResult as DefaultSearchResult,
} from '../../../@seedwork/domain/repository/repository-contracts';
import { Customer } from '../entities/customer';

export namespace CustomerRepository {
	export type Filter = string;

	export class SearchParams extends DefaultSearchParams<Filter> {}

	export class SearchResult extends DefaultSearchResult<Customer, Filter> {}

	export interface Repository
		extends SearchableRepositoryInterface<
			Customer,
			Filter,
			SearchParams,
			SearchResult
		> {}
}

export default CustomerRepository;

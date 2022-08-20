import {
	SearchableRepositoryInterface,
	SearchParams as DefaultSearchParams,
	SearchResult as DefaultSearchResult,
} from '../../../@seedwork/domain/repository/repository-contracts';
import { Group } from '../entities/group';

export namespace GroupRepository {
	export type Filter = string;

	export class SearchParams extends DefaultSearchParams<Filter> {}

	export class SearchResult extends DefaultSearchResult<Group, Filter> {}

	export interface Repository
		extends SearchableRepositoryInterface<
			Group,
			Filter,
			SearchParams,
			SearchResult
		> {}
}

export default GroupRepository;

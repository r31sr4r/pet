import {
	SearchableRepositoryInterface,
	SearchParams as DefaultSearchParams,
	SearchResult as DefaultSearchResult,
} from '../../../@seedwork/domain/repository/repository-contracts';
import { Role } from '../entities/role';

export namespace RoleRepository {
	export type Filter = string;

	export class SearchParams extends DefaultSearchParams<Filter> {}

	export class SearchResult extends DefaultSearchResult<Role, Filter> {}

	export interface Repository
		extends SearchableRepositoryInterface<
			Role,
			Filter,
			SearchParams,
			SearchResult
		> {}
}

export default RoleRepository;

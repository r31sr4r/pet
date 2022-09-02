import {
	SearchableRepositoryInterface,
	SearchParams as DefaultSearchParams,
	SearchResult as DefaultSearchResult,
} from '../../../@seedwork/domain/repository/repository-contracts';
import { UserAssignedToGroupAndRole } from '../entities';

export namespace UserAssignedToGroupAndRoleRepository {
	export type Filter = string;

	export class SearchParams extends DefaultSearchParams<Filter> {}

	export class SearchResult extends DefaultSearchResult<UserAssignedToGroupAndRole, Filter> {}

	export interface Repository
		extends SearchableRepositoryInterface<
            UserAssignedToGroupAndRole,
			Filter,
			SearchParams,
			SearchResult
		> {}
}

export default UserAssignedToGroupAndRoleRepository;

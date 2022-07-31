import {
	SearchableRepositoryInterface,
	SearchParams as DefaultSearchParams,
	SearchResult as DefaultSearchResult,
} from '../../../@seedwork/domain/repository/repository-contracts';
import { Pet } from '../entities/pet';

export namespace PetRepository {
	export type Filter = string;

	export class SearchParams extends DefaultSearchParams<Filter> {}

	export class SearchResult extends DefaultSearchResult<Pet, Filter> {}

	export interface Repository
		extends SearchableRepositoryInterface<
			Pet,
			Filter,
			SearchParams,
			SearchResult
		> {}
}

export default PetRepository;

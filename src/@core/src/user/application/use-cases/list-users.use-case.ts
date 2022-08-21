import {
	PaginationOutputDto,
	PaginationOutputMapper,
} from '../../../@seedwork/application/dto/pagination-output';
import { SearchInputDto } from '../../../@seedwork/application/dto/search-input';
import { default as DefaultUseCase } from '../../../@seedwork/application/use-case';
import { UserRepository } from '../../domain/repository/user.repository';
import { UserOutput, UserOutputMapper } from '../dto/user-output';

export namespace ListUsersUseCase {
	export class UseCase implements DefaultUseCase<Input, Output> {
		constructor(private userRepo: UserRepository.Repository) {}

		async execute(input: Input): Promise<Output> {
			const params = new UserRepository.SearchParams(input);
			const searchResult = await this.userRepo.search(params);

			return this.toOutput(searchResult);
		}

		private toOutput(
			searchResult: UserRepository.SearchResult
		): Output {
			return {
				items: searchResult.items.map((i) =>
					UserOutputMapper.toOutput(i)
				),
				...PaginationOutputMapper.toOutput(searchResult),
			};
		}
	}

	export type Input = SearchInputDto;

	export type Output = PaginationOutputDto<UserOutput>;
}

export default ListUsersUseCase;

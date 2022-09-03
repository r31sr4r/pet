import {
	PaginationOutputDto,
	PaginationOutputMapper,
} from '#seedwork/application/dto/pagination-output';
import { SearchInputDto } from '#seedwork/application/dto/search-input';
import { default as DefaultUseCase } from '#seedwork/application/use-case';
import { UserAssignedToGroupAndRoleRepository } from '../../../domain/repository/user-assigned-to-group-and-role.repository';
import {
	UserAssignedToGroupAndRoleOutput,
	UserAssignedToGroupAndRoleOutputMapper,
} from '../../dto/user-assigned-to-group-and-role-output';

export namespace ListUserAssignedToGroupRoleUseCase {
	export class UseCase implements DefaultUseCase<Input, Output> {
		constructor(
			private roleRepo: UserAssignedToGroupAndRoleRepository.Repository
		) {}

		async execute(input: Input): Promise<Output> {
			const params =
				new UserAssignedToGroupAndRoleRepository.SearchParams(input);
			const searchResult = await this.roleRepo.search(params);

			return this.toOutput(searchResult);
		}

		private toOutput(
			searchResult: UserAssignedToGroupAndRoleRepository.SearchResult
		): Output {
			return {
				items: searchResult.items.map((i) =>
					UserAssignedToGroupAndRoleOutputMapper.toOutput(i)
				),
				...PaginationOutputMapper.toOutput(searchResult),
			};
		}
	}

	export type Input = SearchInputDto;

	export type Output = PaginationOutputDto<UserAssignedToGroupAndRoleOutput>;
}

export default ListUserAssignedToGroupRoleUseCase;

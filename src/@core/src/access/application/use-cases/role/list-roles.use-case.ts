import {
	PaginationOutputDto,
	PaginationOutputMapper,
} from '#seedwork/application/dto/pagination-output';
import { SearchInputDto } from '#seedwork/application/dto/search-input';
import { default as DefaultUseCase } from '#seedwork/application/use-case';
import { RoleRepository } from '../../../domain/repository/role.repository';
import { RoleOutput, RoleOutputMapper } from '../../dto/role-output';

export namespace ListRolesUseCase {
	export class UseCase implements DefaultUseCase<Input, Output> {
		constructor(private roleRepo: RoleRepository.Repository) {}

		async execute(input: Input): Promise<Output> {
			const params = new RoleRepository.SearchParams(input);
			const searchResult = await this.roleRepo.search(params);

			return this.toOutput(searchResult);
		}

		private toOutput(
			searchResult: RoleRepository.SearchResult
		): Output {
			return {
				items: searchResult.items.map((i) =>
					RoleOutputMapper.toOutput(i)
				),
				...PaginationOutputMapper.toOutput(searchResult),
			};
		}
	}

	export type Input = SearchInputDto;

	export type Output = PaginationOutputDto<RoleOutput>;
}

export default ListRolesUseCase;

import {
	PaginationOutputDto,
	PaginationOutputMapper,
} from '#seedwork/application/dto/pagination-output';
import { SearchInputDto } from '#seedwork/application/dto/search-input';
import { default as DefaultUseCase } from '#seedwork/application/use-case';
import { GroupRepository } from '../../../domain/repository/group.repository';
import { GroupOutput, GroupOutputMapper } from '../../dto/group-output';

export namespace ListGroupsUseCase {
	export class UseCase implements DefaultUseCase<Input, Output> {
		constructor(private groupRepo: GroupRepository.Repository) {}

		async execute(input: Input): Promise<Output> {
			const params = new GroupRepository.SearchParams(input);
			const searchResult = await this.groupRepo.search(params);

			return this.toOutput(searchResult);
		}

		private toOutput(
			searchResult: GroupRepository.SearchResult
		): Output {
			return {
				items: searchResult.items.map((i) =>
					GroupOutputMapper.toOutput(i)
				),
				...PaginationOutputMapper.toOutput(searchResult),
			};
		}
	}

	export type Input = SearchInputDto;

	export type Output = PaginationOutputDto<GroupOutput>;
}

export default ListGroupsUseCase;

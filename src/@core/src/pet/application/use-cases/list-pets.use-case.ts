import {
	PaginationOutputDto,
	PaginationOutputMapper,
} from '../../../@seedwork/application/dto/pagination-output';
import { SearchInputDto } from '../../../@seedwork/application/dto/search-input';
import { default as DefaultUseCase } from '../../../@seedwork/application/use-case';
import { PetRepository } from '../../domain/repository/pet.repository';
import { PetOutput, PetOutputMapper } from '../dto/pet-output';

export namespace ListPetsUseCase {
	export class UseCase implements DefaultUseCase<Input, Output> {
		constructor(private petRepo: PetRepository.Repository) {}

		async execute(input: Input): Promise<Output> {
			const params = new PetRepository.SearchParams(input);
			const searchResult = await this.petRepo.search(params);

			return this.toOutput(searchResult);
		}

		private toOutput(
			searchResult: PetRepository.SearchResult
		): Output {
			return {
				items: searchResult.items.map((i) =>
					PetOutputMapper.toOutput(i)
				),
				...PaginationOutputMapper.toOutput(searchResult),
			};
		}
	}

	export type Input = SearchInputDto;

	export type Output = PaginationOutputDto<PetOutput>;
}

export default ListPetsUseCase;

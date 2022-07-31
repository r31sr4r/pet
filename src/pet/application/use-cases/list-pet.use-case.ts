import { PaginationOutputDto, PaginationOutputMapper } from '../../../@seedwork/application/dto/pagination-output';
import { SearchInputDto } from '../../../@seedwork/application/dto/search-input';
import UseCase from '../../../@seedwork/application/use-case';
import PetRepository from '../../domain/repository/pet.repository';
import { PetOutput, PetOutputMapper } from '../dto/pet-output';

export default class CreatePetUseCase implements UseCase<Input, Output> {
	constructor(private petRepository: PetRepository.Repository) {}

	async execute(input: Input): Promise<Output> {
		const params = new PetRepository.SearchParams(input);
		const searchResult = await this.petRepository.search(params);

		return this.toOutput(searchResult);
	}

	private toOutput(searchResult: PetRepository.SearchResult): Output {
		const items = searchResult.items.map((item) =>
			PetOutputMapper.toOutput(item)
		);
		const pagination = PaginationOutputMapper.toOutput(searchResult);
		return {
			items,
			...pagination,
		};
	}
}

export type Input = SearchInputDto;

export type Output = PaginationOutputDto<PetOutput>;
import { default as DefaultUseCase } from '../../../@seedwork/application/use-case';
import PetRepository from '../../domain/repository/pet.repository';
import { PetOutput, PetOutputMapper } from '../dto/pet-output';

export namespace GetPetUseCase {
	export class UseCase implements DefaultUseCase<Input, Output> {
		constructor(private petRepository: PetRepository.Repository) {}

		async execute(input: Input): Promise<Output> {
			const entity = await this.petRepository.findById(input.id);
			return PetOutputMapper.toOutput(entity);
		}
	}

	export type Input = {
		id: string;
	};

	export type Output = PetOutput;
}

export default GetPetUseCase;

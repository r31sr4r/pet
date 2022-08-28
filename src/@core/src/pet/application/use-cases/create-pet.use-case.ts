import { default as DefaultUseCase } from '../../../@seedwork/application/use-case';
import { Pet } from '../../domain/entities/pet';
import PetRepository from '../../domain/repository/pet.repository';
import { PetOutput, PetOutputMapper } from '../dto/pet-output';

export namespace CreatePetUseCase {
	export class UseCase implements DefaultUseCase<Input, Output> {
		constructor(private petRepository: PetRepository.Repository) {}

		async execute(input: Input): Promise<Output> {
			const entity = new Pet(input);
			await this.petRepository.insert(entity);
			return PetOutputMapper.toOutput(entity);
		}
	}

	export type Input = {
		name: string;
		type: string;
		breed?: string;
		gender?: string;
		birth_date?: Date;
		is_active?: boolean;
		customer_id: string;
	};

	export type Output = PetOutput;
}

export default CreatePetUseCase;

import UseCase from '../../../@seedwork/application/use-case';
import PetRepository from '../../domain/repository/pet.repository';
import { PetOutput } from '../dto/pet-output.dto';

export default class CreatePetUseCase implements UseCase<Input, Output> {
	constructor(private petRepository: PetRepository.Repository) {}

	async execute(input: Input): Promise<Output> {
		const entity = await this.petRepository.findById(input.id);
		return {
			id: entity.id,
			name: entity.name,
			type: entity.type,
            breed: entity.breed,
            gender: entity.gender,
            birth_date: entity.birth_date,
			is_active: entity.is_active,
			created_at: entity.created_at,
		};
	}
}

export type Input = {
    id: string;
};

export type Output = PetOutput;
import UseCase from '../../../@seedwork/application/use-case';
import { PetRepository } from '../../domain/repository/pet.repository';
import { PetOutput, PetOutputMapper } from '../dto/pet-output';

export default class UpdatePetUseCase implements UseCase<Input, Output> {
	constructor(private petRepository: PetRepository.Repository) {}

	async execute(input: Input): Promise<Output> {
		const entity = await this.petRepository.findById(input.id);
		entity.update(
			input.name,
			input.type,
			input.breed,
			input.gender,
			input.birth_date
		);

		if (input.is_active === true) {
			entity.activate();
		}

		if (input.is_active === false) {
			entity.deactivate();
		}

		await this.petRepository.update(entity);
		return PetOutputMapper.toOutput(entity);
	}
}

export type Input = {
	id: string;
	name: string;
	type: string;
	breed?: string;
	gender?: string;
	birth_date?: Date;
	is_active?: boolean;
};

export type Output = PetOutput;

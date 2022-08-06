import { PetRepository } from "#pet/domain";
import { default as DefaultUseCase } from "../../../@seedwork/application/use-case";

export namespace DeletePetUseCase {
    export class UseCase implements DefaultUseCase<Input, Output> {
        constructor(
            private petRepository: PetRepository.Repository
        ) {}

        async execute(input: Input): Promise<Output> {
            const entity = await this.petRepository.findById(input.id);
            await this.petRepository.delete(entity.id);
        }
    }

    export type Input = {
        id: string;
    };

    export type Output = void;
}

export default DeletePetUseCase;
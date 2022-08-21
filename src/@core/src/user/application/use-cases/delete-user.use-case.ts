import { UserRepository } from "#user/domain";
import { default as DefaultUseCase } from "../../../@seedwork/application/use-case";

export namespace DeleteUserUseCase {
    export class UseCase implements DefaultUseCase<Input, Output> {
        constructor(
            private userRepository: UserRepository.Repository
        ) {}

        async execute(input: Input): Promise<Output> {
            const entity = await this.userRepository.findById(input.id);
            await this.userRepository.delete(entity.id);
        }
    }

    export type Input = {
        id: string;
    };

    export type Output = void;
}

export default DeleteUserUseCase;
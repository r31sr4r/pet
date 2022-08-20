import { GroupRepository } from "#access/domain";
import { default as DefaultUseCase } from "../../../../@seedwork/application/use-case";

export namespace DeleteGroupUseCase {
    export class UseCase implements DefaultUseCase<Input, Output> {
        constructor(
            private groupRepository: GroupRepository.Repository
        ) {}

        async execute(input: Input): Promise<Output> {
            const entity = await this.groupRepository.findById(input.id);
            await this.groupRepository.delete(entity.id);
        }
    }

    export type Input = {
        id: string;
    };

    export type Output = void;
}

export default DeleteGroupUseCase;
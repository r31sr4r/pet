import { UserAssignedToGroupAndRoleRepository } from "#access/domain";
import { default as DefaultUseCase } from "#seedwork/application/use-case";

export namespace DeleteUserAssignedToGroupAndRoleUseCase {
    export class UseCase implements DefaultUseCase<Input, Output> {
        constructor(
            private roleRepository: UserAssignedToGroupAndRoleRepository.Repository
        ) {}

        async execute(input: Input): Promise<Output> {
            const entity = await this.roleRepository.findById(input.id);
            await this.roleRepository.delete(entity.id);
        }
    }

    export type Input = {
        id: string;
    };

    export type Output = void;
}

export default DeleteUserAssignedToGroupAndRoleUseCase;
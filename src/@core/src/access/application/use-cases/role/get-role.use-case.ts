import { default as DefaultUseCase } from "#seedwork/application/use-case";
import RoleRepository from '../../../domain/repository/role.repository';
import { RoleOutput, RoleOutputMapper } from '../../dto/role-output';

export namespace GetRoleUseCase {
	export class UseCase implements DefaultUseCase<Input, Output> {
		constructor(
			private roleRepository: RoleRepository.Repository
		) {}

		async execute(input: Input): Promise<Output> {
			const entity = await this.roleRepository.findById(input.id);
			return RoleOutputMapper.toOutput(entity);
		}
	}

	export type Input = {
		id: string;
	};

	export type Output = RoleOutput;
}

export default GetRoleUseCase;

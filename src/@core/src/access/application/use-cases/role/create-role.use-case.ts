import { default as DefaultUseCase } from '../../../../@seedwork/application/use-case';
import { Role } from '../../../domain/entities/role';
import RoleRepository from '../../../domain/repository/role.repository';
import { RoleOutput, RoleOutputMapper } from '../../dto/role-output';

export namespace CreateRoleUseCase {
	export class UseCase
		implements DefaultUseCase<Input, Output>
	{
		constructor(
			private roleRepository: RoleRepository.Repository
		) {}

		async execute(input: Input): Promise<Output> {
			const entity = new Role(input);
			await this.roleRepository.insert(entity);
			return RoleOutputMapper.toOutput(entity);
		}
	}

	export type Input = {
		name: string;
		description: string;
		is_active?: boolean;
	};

	export type Output = RoleOutput;
}

export default CreateRoleUseCase;

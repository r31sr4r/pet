import { default as DefaultUseCase } from "#seedwork/application/use-case";
import { RoleRepository } from '../../../domain/repository/role.repository';
import { RoleOutput, RoleOutputMapper } from '../../dto/role-output';

export namespace UpdateRoleUseCase {
export class UseCase implements DefaultUseCase<Input, Output> {
	constructor(private roleRepository: RoleRepository.Repository) {}

	async execute(input: Input): Promise<Output> {
		const entity = await this.roleRepository.findById(input.id);
		entity.update(input.name, input.description);

		if(input.is_active === true) {
			entity.activate();
		}

		if(input.is_active === false) {
			entity.deactivate();
		}

		await this.roleRepository.update(entity);
		return RoleOutputMapper.toOutput(entity);
	}
}

export type Input = {
	id: string;
	name: string;
	description?: string;
	is_active?: boolean;
};

export type Output = RoleOutput;

}

export default UpdateRoleUseCase;

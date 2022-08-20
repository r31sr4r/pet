import { default as DefaultUseCase } from "#seedwork/application/use-case";
import { GroupRepository } from '../../../domain/repository/group.repository';
import { GroupOutput, GroupOutputMapper } from '../../dto/group-output';

export namespace UpdateGroupUseCase {
export class UseCase implements DefaultUseCase<Input, Output> {
	constructor(private groupRepository: GroupRepository.Repository) {}

	async execute(input: Input): Promise<Output> {
		const entity = await this.groupRepository.findById(input.id);
		entity.update(input.name, input.description);

		if(input.is_active === true) {
			entity.activate();
		}

		if(input.is_active === false) {
			entity.deactivate();
		}

		await this.groupRepository.update(entity);
		return GroupOutputMapper.toOutput(entity);
	}
}

export type Input = {
	id: string;
	name: string;
	description?: string;
	is_active?: boolean;
};

export type Output = GroupOutput;

}

export default UpdateGroupUseCase;

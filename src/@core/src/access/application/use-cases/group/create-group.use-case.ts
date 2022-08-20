import { default as DefaultUseCase } from '../../../../@seedwork/application/use-case';
import { Group } from '../../../domain/entities/group';
import GroupRepository from '../../../domain/repository/group.repository';
import { GroupOutput, GroupOutputMapper } from '../../dto/group-output';

export namespace CreateGroupUseCase {
	export class UseCase
		implements DefaultUseCase<Input, Output>
	{
		constructor(
			private groupRepository: GroupRepository.Repository
		) {}

		async execute(input: Input): Promise<Output> {
			const entity = new Group(input);
			await this.groupRepository.insert(entity);
			return GroupOutputMapper.toOutput(entity);
		}
	}

	export type Input = {
		name: string;
		description: string;
		is_active?: boolean;
	};

	export type Output = GroupOutput;
}

export default CreateGroupUseCase;

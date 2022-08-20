import { default as DefaultUseCase } from "#seedwork/application/use-case";
import GroupRepository from '../../../domain/repository/group.repository';
import { GroupOutput, GroupOutputMapper } from '../../dto/group-output';

export namespace GetGroupUseCase {
	export class UseCase implements DefaultUseCase<Input, Output> {
		constructor(
			private groupRepository: GroupRepository.Repository
		) {}

		async execute(input: Input): Promise<Output> {
			const entity = await this.groupRepository.findById(input.id);
			return GroupOutputMapper.toOutput(entity);
		}
	}

	export type Input = {
		id: string;
	};

	export type Output = GroupOutput;
}

export default GetGroupUseCase;

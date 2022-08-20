import { Group } from "../../domain/entities/group";

export type GroupOutput = {
	id: string;
	name: string;
	description: string | null;
	is_active: boolean;
	created_at: Date;
};

export class GroupOutputMapper {
	static toOutput(entity: Group): GroupOutput {
		return entity.toJSON();
	}
}
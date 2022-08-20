import { Role } from "../../domain/entities/role";

export type RoleOutput = {
	id: string;
	name: string;
	description: string | null;
	is_active: boolean;
	created_at: Date;
};

export class RoleOutputMapper {
	static toOutput(entity: Role): RoleOutput {
		return entity.toJSON();
	}
}
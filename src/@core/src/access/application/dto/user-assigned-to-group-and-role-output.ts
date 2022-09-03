import { UserAssignedToGroupAndRole } from "../../domain/entities/user-assigned-to-group-and-role";

export type UserAssignedToGroupAndRoleOutput = {
	id: string;
	user_id: string;
	group_id: string;
	role_id: string;
	created_at: Date;
};

export class UserAssignedToGroupAndRoleOutputMapper {
	static toOutput(entity: UserAssignedToGroupAndRole): UserAssignedToGroupAndRoleOutput {
		return entity.toJSON();
	}
}
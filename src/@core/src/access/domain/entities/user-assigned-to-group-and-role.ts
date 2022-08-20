import { UniqueEntityId } from "#seedwork/domain";
import Entity from "#seedwork/domain/entity/entity";
import { User } from "user/domain/entities/user";
import { Group } from "./group";
import { Role } from "./role";

export type UserAssignedToGroupAndRoleProperties = {
    user: User;
    group: Group;
    role: Role;
    created_at?: Date;
};

export class UserAssignedToGroupAndRole extends Entity<UserAssignedToGroupAndRoleProperties> {
    constructor(public readonly props: UserAssignedToGroupAndRoleProperties, id?: UniqueEntityId) {
        super(props, id);
		this.props.created_at = this.props.created_at ?? new Date();
    }
    
    get created_at(): Date {
		return this.props.created_at;
	}
}
import { EntityValidationError, UniqueEntityId } from '#seedwork/domain';
import Entity from '#seedwork/domain/entity/entity';
import UserAssignedToGroupAndRoleValidatorFactory from '../validators/user-assigned-to-group-and-role.validator';

export type UserAssignedToGroupAndRoleProperties = {
	user_id: string;
	group_id: string;
	role_id: string;
	created_at?: Date;
};

export class UserAssignedToGroupAndRole extends Entity<UserAssignedToGroupAndRoleProperties> {
	constructor(
		public readonly props: UserAssignedToGroupAndRoleProperties,
		id?: UniqueEntityId
	) {
		super(props, id);
		this.props.created_at = this.props.created_at ?? new Date();
	}

	static validate(props: UserAssignedToGroupAndRoleProperties): void {
		const validator = UserAssignedToGroupAndRoleValidatorFactory.create();
		validator.validate(props);
		const isValid = validator.validate(props);
		if (!isValid) {
			throw new EntityValidationError(validator.errors);
		}
	}

	get created_at(): Date {
		return this.props.created_at;
	}
}

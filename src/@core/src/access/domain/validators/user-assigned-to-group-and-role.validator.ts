import { ClassValidatorFields } from '#seedwork/domain';
import { IsDate, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { UserAssignedToGroupAndRoleProperties } from '../entities';

export class UserAssignedToGroupAndRoleRules {
	@IsUUID('4')
	@IsNotEmpty()
	user_id: string;

	@IsUUID('4')
	@IsNotEmpty()
	group_id: string;

	@IsUUID('4')
	@IsNotEmpty()
	role_id: string;

	@IsDate()
	@IsOptional()
	created_at: Date;

	constructor({
        user_id,
        group_id,
        role_id,
        created_at,
	}: UserAssignedToGroupAndRoleProperties) {
		Object.assign(this, {
            user_id,
            group_id,
            role_id,
			created_at,
		});
	}
}

export class UserAssignedToGroupAndRoleValidator extends ClassValidatorFields<UserAssignedToGroupAndRoleRules> {
	validate(data: UserAssignedToGroupAndRoleProperties): boolean {
		return super.validate(
			new UserAssignedToGroupAndRoleRules(data ?? ({} as any))
		);
	}
}

export class UserAssignedToGroupAndRoleValidatorFactory {
	static create() {
		return new UserAssignedToGroupAndRoleValidator();
	}
}

export default UserAssignedToGroupAndRoleValidatorFactory;

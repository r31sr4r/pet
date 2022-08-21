import { User } from "user/domain/entities/user";

export type UserOutput = {
	id: string;
	name: string;
	email: string;
	password: string;
	is_active: boolean;
	created_at: Date;
};

export class UserOutputMapper {
	static toOutput(entity: User): UserOutput {
		return entity.toJSON();
	}
}
import {
	IsBoolean,
	IsDate,
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	MaxLength,
	MinLength,
} from 'class-validator';
import ClassValidatorFields from '../../../@seedwork/domain/validators/class-validator-fields';
import { UserProperties } from '../entities/user';

export class UserRules {
	@MaxLength(255)
	@MinLength(3)
	@IsString()
	@IsNotEmpty()
	name: string;

    @IsEmail()
	@MaxLength(255)
	@IsString()
	@IsNotEmpty()
	email: string;

	@IsBoolean()
	@IsOptional()
	is_active: boolean;

	@IsString()
	@IsOptional()
	group: string;
	
	@IsString()
	@IsOptional()
	role: string;

	@IsDate()
	@IsOptional()
	created_at: Date;

	constructor({
		name,
		email,
		is_active,
		group,
		role,
		created_at,
	}: UserProperties) {
		Object.assign(this, {
			name,
			email,
			is_active,
			group,
			role,
			created_at,
		});
	}
}

export class UserValidator extends ClassValidatorFields<UserRules> {
	validate(data: UserProperties): boolean {
		return super.validate(new UserRules(data ?? {} as any));
	}
}

export class UserValidatorFactory{
    static create() {
        return new UserValidator();
    }
}

export default UserValidatorFactory;

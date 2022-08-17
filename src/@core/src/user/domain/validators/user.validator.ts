import {
	IsBoolean,
	IsDate,
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	MaxLength,
} from 'class-validator';
import ClassValidatorFields from '../../../@seedwork/domain/validators/class-validator-fields';
import { UserProperties } from '../entities/user';

export class UserRules {
	@MaxLength(255)
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

	@IsDate()
	@IsOptional()
	created_at: Date;

	constructor({
		name,
		email,
        password,
		is_active,
		created_at,
	}: UserProperties) {
		Object.assign(this, {
			name,
			email,
            password,
			is_active,
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

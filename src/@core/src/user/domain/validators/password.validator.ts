import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import ClassValidatorFields from '../../../@seedwork/domain/validators/class-validator-fields';

export class PasswordRules {
	@IsString()
	@MinLength(6)
	@Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
		message:
			'Password too weak. Use at least one uppercase letter, one lowercase letter, one number or one special character',
	})
	password: string;

	constructor(password: string) {
		Object.assign(this, {
			password,
		});
	}
}

export class PasswordValidator extends ClassValidatorFields<PasswordRules> {
	validate(password): boolean {
		return super.validate(new PasswordRules(password ?? ('' as any)));
	}
}

export class PasswordValidatorFactory {
	static create() {
		return new PasswordValidator();
	}
}

export default PasswordValidatorFactory;

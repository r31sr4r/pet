import {
	EntityValidationError,
	UniqueEntityId,
	ValidationError,
	ValidatorRules,
} from '#seedwork/domain';
import Entity from '#seedwork/domain/entity/entity';
import { Crypt } from '#seedwork/infra/utils/crypt/crypt';
import PasswordValidatorFactory from '../validators/password.validator';
import UserValidatorFactory from '../validators/user.validator';

export type UserProperties = {
	name: string;
	email: string;
	password?: string;
	is_active?: boolean;
	created_at?: Date;
};

export class User extends Entity<UserProperties> {
	constructor(
		public readonly props: UserProperties,
		id?: UniqueEntityId,
		isMapping = false
	) {
		User.validate(props);
		User.validatePassword(props.password);
		super(props, id);
		if (!isMapping) {
			this.password = this.props.password;
		}
		this.is_active = this.props.is_active;
		this.props.created_at = this.props.created_at ?? new Date();
	}

	updatePassword(currentPassword: string, changedPassword: string) {
		if (!Crypt.compareSync(currentPassword, this.password)) {
			throw new ValidationError('Current password is not valid');
		}
		User.validatePassword(changedPassword);
		this.password = changedPassword;
	}

	update(name: string, email: string) {
		User.validate({ name, email });
		this.name = name;
		this.email = email;
	}

	activate() {
		ValidatorRules.values(this.props.is_active, 'is_active').boolean();
		this.is_active = true;
	}

	deactivate() {
		ValidatorRules.values(this.props.is_active, 'is_active').boolean();
		this.is_active = false;
	}

	static validate(props: UserProperties): void {
		const validator = UserValidatorFactory.create();
		const isValid = validator.validate(props);
		if (!isValid) {
			throw new EntityValidationError(validator.errors);
		}
	}

	static validatePassword(password: string): void {
		const validator = PasswordValidatorFactory.create();
		const isValid = validator.validate(password);
		if (!isValid) {
			throw new EntityValidationError(validator.errors);
		}
	}

	get name(): string {
		return this.props.name;
	}

	private set name(value) {
		this.props.name = value;
	}

	get email(): string {
		return this.props.email;
	}

	private set email(value) {
		this.props.email = value;
	}

	get password(): string {
		return this.props.password;
	}

	private set password(value) {
		this.props.password = Crypt.hashSync(value);
	}

	get is_active(): boolean {
		return this.props.is_active;
	}

	private set is_active(value) {
		this.props.is_active = value ?? true;
	}

	get created_at(): Date {
		return this.props.created_at;
	}
}


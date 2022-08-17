import { EntityValidationError, UniqueEntityId } from "#seedwork/domain";
import Entity from "#seedwork/domain/entity/entity";
import UserValidatorFactory from "../validators/user.validator";

export type UserProperties = {
    name: string;
    email: string;
    password: string;
    is_active?: boolean;
	created_at?: Date;    
};

export class User extends Entity<UserProperties> {
    constructor(public readonly props: UserProperties, id?: UniqueEntityId) {
        User.validate(props);
        super(props, id);
        this.is_active = this.props.is_active;
        this.props.created_at = this.props.created_at ?? new Date();
    }

    updatePassword(password: string) {
        User.validatePassword(password );
        this.password = password;
    }

    static validate(props: UserProperties): void {
		const validator = UserValidatorFactory.create();
		validator.validate(props);
		const isValid = validator.validate(props);
		if (!isValid) {
			throw new EntityValidationError(validator.errors);
		}		
	}

    static validatePassword(password: string): void {
        const validator = UserValidatorFactory.createPasswordValidator();
        const isValid = validator.validate(password);
        if (!isValid) {
            throw new EntityValidationError(validator.errors);
        }
    }

	private set is_active(value) {
		this.props.is_active = value ?? true;
	}

    private set password(value) {
        this.props.password = value;
    }
}


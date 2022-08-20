import { EntityValidationError, UniqueEntityId, ValidatorRules } from "#seedwork/domain";
import Entity from "#seedwork/domain/entity/entity";
import RoleValidatorFactory from "../validators/role.validator";


export type RoleProperties = {
	name: string;
	description: string;	
	is_active?: boolean;
	created_at?: Date;
};

export class Role extends Entity<RoleProperties> {
    constructor(public readonly props: RoleProperties, id?: UniqueEntityId) {
        Role.validate(props);
        super(props, id);
        this.is_active = this.props.is_active;
		this.props.created_at = this.props.created_at ?? new Date();
    }

    update(name: string, description: string) {
        Role.validate({ name, description });
        this.name = name;
        this.description = description;
    }

    activate() {
        ValidatorRules.values(this.props.is_active, 'is_active').boolean();
        this.is_active = true;
    }

    deactivate() {
        ValidatorRules.values(this.props.is_active, 'is_active').boolean();
        this.is_active = false;
    }

    static validate(props: RoleProperties): void {
        const validator = RoleValidatorFactory.create();
        const isValid = validator.validate(props);
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

    get description(): string {
        return this.props.description;
    }

    private set description(value) {
        this.props.description = value;
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
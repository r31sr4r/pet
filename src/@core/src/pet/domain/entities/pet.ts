import ValidatorRules from '../../../@seedwork/domain/validators/validator-rules';
import Entity from '../../../@seedwork/domain/entity/entity';
import UniqueEntityId from '../../../@seedwork/domain/value-objects/unique-entity-id.vo';
import PetValidatorFactory from '../validators/pet.validator';
import { EntityValidationError } from '../../../@seedwork/domain/errors/validation-error';

export type PetProperties = {	
	name: string;
	type: string;
	breed?: string;
	gender?: string;
	birth_date?: Date;
	is_active?: boolean;
	created_at?: Date;
	customer_id: string;
};

export class Pet extends Entity<PetProperties> {
	constructor(public readonly props: PetProperties, id?: UniqueEntityId) {
		Pet.validate(props);
		super(props, id);
		this.breed = this.props.breed;
		this.gender = this.props.gender;
		this.birth_date = this.props.birth_date;
		this.is_active = this.props.is_active;
		this.props.created_at = this.props.created_at ?? new Date();
	}

	update(
		name: string,
		type: string,
		customer_id: string,
		breed?: string,
		gender?: string,
		birth_date?: Date
	) {
		Pet.validate({ name, type, breed, gender, birth_date, customer_id });
		this.name = name;
		this.type = type;
		this.breed = breed;
		this.gender = gender;
		this.birth_date = birth_date;		
	}

	// static validate(props: Omit<PetProperties, 'created_at'>): void {
	// 	ValidatorRules.values(props.name, 'name').required().string().maxlength(100);
	// 	ValidatorRules.values(props.type, 'type').required().string();
	// 	ValidatorRules.values(props.breed, 'breed').string();
	// 	ValidatorRules.values(props.is_active, 'is_active').boolean();
	//     ValidatorRules.values(props.birth_date, 'birth_date').date();
	// }

	static validate(props: PetProperties): void {
		const validator = PetValidatorFactory.create();
		validator.validate(props);
		const isValid = validator.validate(props);
		if (!isValid) {
			throw new EntityValidationError(validator.errors);
		}		
	}

	activate() {
		ValidatorRules.values(this.props.is_active, 'is_active').boolean();
		this.is_active = true;
	}

	deactivate() {
		ValidatorRules.values(this.props.is_active, 'is_active').boolean();
		this.is_active = false;
	}

	get name(): string {
		return this.props.name;
	}

	private set name(value) {
		this.props.name = value;
	}

	get type(): string {
		return this.props.type;
	}

	private set type(value) {
		this.props.type = value;
	}

	get breed(): string {
		return this.props.breed;
	}

	private set breed(value) {
		this.props.breed = value ?? null;
	}

	get gender(): string {
		return this.props.gender;
	}

	private set gender(value) {
		this.props.gender = value ?? null;
	}

	get birth_date(): Date {
		return this.props.birth_date;
	}

	private set birth_date(value) {
		this.props.birth_date = value ?? null;
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

	get customer_id(): string {
		return this.props.customer_id;
	}
}

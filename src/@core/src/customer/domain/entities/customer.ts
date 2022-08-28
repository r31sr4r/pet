import ValidatorRules from '../../../@seedwork/domain/validators/validator-rules';
import Entity from '../../../@seedwork/domain/entity/entity';
import UniqueEntityId from '../../../@seedwork/domain/value-objects/unique-entity-id.vo';
import CustomerValidatorFactory from '../validators/customer.validator';
import { EntityValidationError } from '../../../@seedwork/domain/errors/validation-error';
import { Pet } from '#pet/domain';

export type CustomerProperties = {
	name: string;
	email: string;	
	cellphone?: string;
	cpf?: string;
	gender?: string;
	birth_date?: Date;
	is_active?: boolean;
	pets?: Pet[];
	created_at?: Date;
	updated_at?: Date;
};

export class Customer extends Entity<CustomerProperties> {
	constructor(public readonly props: CustomerProperties, id?: UniqueEntityId) {
		Customer.validate(props);
		super(props, id);
		this.cellphone = this.props.cellphone;
		this.cpf = this.props.cpf;
		this.gender = this.props.gender;
		this.birth_date = this.props.birth_date;
		this.is_active = this.props.is_active;		
		this.props.created_at = this.props.created_at ?? new Date();
		this.updated_at = this.props.updated_at;
	}

	update(
		name: string,
		email: string,		
		cellphone?: string,
		cpf?: string,		
		gender?: string,
		birth_date?: Date
	) {
		Customer.validate({ name, email, cellphone, cpf, gender, birth_date });
		this.name = name;
		this.email = email;
		this.cellphone = cellphone;
		this.cpf = cpf;		
		this.gender = gender;
		this.birth_date = birth_date;
		this.updated_at = new Date();
	}

	static validate(props: CustomerProperties): void {
		const validator = CustomerValidatorFactory.create();
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

	get email(): string {
		return this.props.email;
	}

	private set email(value) {
		this.props.email = value;
	}

	get cellphone(): string {
		return this.props.cellphone;
	}

	private set cellphone(value) {
		this.props.cellphone = value ?? null;
	}
	
	get cpf(): string {
		return this.props.cpf;
	}

	private set cpf(value) {
		this.props.cpf = value ?? null;
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

	get updated_at(): Date {
		return this.props.updated_at;
	}

	set updated_at(value) {
		this.props.updated_at = value ?? null;
	}
}

import {
	IsBoolean,
	IsDate,
	IsEmail,
	IsMobilePhone,
	IsNotEmpty,
	IsOptional,
	IsString,
	Matches,
	MaxLength,
	MinLength,
} from 'class-validator';
import ClassValidatorFields from '../../../@seedwork/domain/validators/class-validator-fields';
import { CustomerProperties } from '../entities/customer';

export class CustomerRules {
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

    @IsMobilePhone('pt-BR')
	@IsOptional()	
	cellphone: string;

	@Matches(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, {
		message:
			'Incorrect format for cpf. Expected: xxx.xxx.xxx-xx',
	})
	@IsOptional()
	cpf: string;

	@IsString()
	@IsOptional()
	gender: string;

	@IsDate()
	@IsOptional()
	birth_date: Date;

	@IsBoolean()
	@IsOptional()
	is_active: boolean;

	@IsDate()
	@IsOptional()
	created_at: Date;

	@IsDate()
	@IsOptional()
	updated_at: Date;

	constructor({
		name,
		email,
		cellphone,
		cpf,		
		gender,
		is_active,
        birth_date,
		created_at,
		updated_at,
	}: CustomerProperties) {
		Object.assign(this, {
			name,
			email,
			cellphone,
			cpf,            
			gender,
			is_active,
            birth_date,
			created_at,
			updated_at,
		});
	}
}

export class CustomerValidator extends ClassValidatorFields<CustomerRules> {
	validate(data: CustomerProperties): boolean {
		return super.validate(new CustomerRules(data ?? {} as any));
	}
}

export class CustomerValidatorFactory{
    static create() {
        return new CustomerValidator();
    }
}

export default CustomerValidatorFactory;

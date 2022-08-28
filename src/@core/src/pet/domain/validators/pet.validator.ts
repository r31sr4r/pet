import {
	IsBoolean,
	IsDate,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUUID,
	MaxLength,
} from 'class-validator';
import ClassValidatorFields from '../../../@seedwork/domain/validators/class-validator-fields';
import { PetProperties } from '../entities/pet';

export class PetRules {
	@MaxLength(100)
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsNotEmpty()
	type: string;

    @IsString()
	@IsOptional()
	breed: string;

	@IsString()
	@IsOptional()
	gender: string;

	@IsBoolean()
	@IsOptional()
	is_active: boolean;

    @IsDate()
	@IsOptional()
	birth_date: Date;

	@IsDate()
	@IsOptional()
	created_at: Date;

	@IsUUID('4')
	@IsNotEmpty()
	customer_id: string;

	constructor({
		name,
		type,
        breed,
		gender,
		is_active,
        birth_date,
		created_at,
		customer_id,
	}: PetProperties) {
		Object.assign(this, {
			name,
            type,
            breed,
			gender,
			is_active,
            birth_date,
			created_at,
			customer_id,
		});
	}
}

export class PetValidator extends ClassValidatorFields<PetRules> {
	validate(data: PetProperties): boolean {
		return super.validate(new PetRules(data ?? {} as any));
	}
}

export class PetValidatorFactory{
    static create() {
        return new PetValidator();
    }
}

export default PetValidatorFactory;

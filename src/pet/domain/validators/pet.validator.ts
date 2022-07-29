import {
	IsBoolean,
	IsDate,
	IsNotEmpty,
	IsOptional,
	IsString,
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

	@IsBoolean()
	@IsOptional()
	is_active: boolean;

    @IsDate()
	@IsOptional()
	birth_date: Date;

	@IsDate()
	@IsOptional()
	created_at: Date;

	constructor({
		name,
		type,
        breed,
		is_active,
        birth_date,
		created_at,
	}: PetProperties) {
		Object.assign(this, {
			name,
            type,
            breed,
			is_active,
            birth_date,
			created_at,
		});
	}
}

export class PetValidator extends ClassValidatorFields<PetRules> {
	validate(data: PetProperties): boolean {
		return super.validate(new PetRules(data ?? {} as any));
	}
}

export default class PetValidatorFactory{
    static create() {
        return new PetValidator();
    }
}

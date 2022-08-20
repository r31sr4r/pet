import { ClassValidatorFields } from "#seedwork/domain";
import { RoleProperties } from "access/domain/entities/role";
import { IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class RoleRules {
    @MaxLength(255)
    @MinLength(3)
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;
    
    @IsBoolean()
	@IsOptional()
	is_active: boolean;

    @IsDate()
	@IsOptional()
	created_at: Date;

    constructor({
        name,
        description,
        is_active,
        created_at,
    }: RoleProperties) {
        Object.assign(this, {
            name,
            description,
            is_active,
            created_at,
        });
    }    
}

export class RoleValidator extends ClassValidatorFields<RoleRules> {
    validate(data: RoleProperties): boolean {
        return super.validate(new RoleRules(data ?? {} as any));
    }
}

export class RoleValidatorFactory{
    static create() {
        return new RoleValidator();
    }
}

export default RoleValidatorFactory;
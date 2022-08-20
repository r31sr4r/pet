import { ClassValidatorFields } from "#seedwork/domain";
import { GroupProperties } from "access/domain/entities/group";
import { IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class GroupRules {
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
    }: GroupProperties) {
        Object.assign(this, {
            name,
            description,
            is_active,
            created_at,
        });
    }    
}

export class GroupValidator extends ClassValidatorFields<GroupRules> {
    validate(data: GroupProperties): boolean {
        return super.validate(new GroupRules(data ?? {} as any));
    }
}

export class GroupValidatorFactory{
    static create() {
        return new GroupValidator();
    }
}

export default GroupValidatorFactory;
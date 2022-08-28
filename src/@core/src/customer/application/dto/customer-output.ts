import { Pet } from "#pet/domain";
import { Customer } from "customer/domain/entities/customer";

export type CustomerOutput = {
	id: string;
	name: string;
	email: string;	
	cellphone: string | null;
	cpf: string | null;
	gender: string | null;
	birth_date: Date | null;
	is_active: boolean;
	pets: Pet[] | null;
	created_at: Date;
	updated_at: Date | null;	
};

export class CustomerOutputMapper {
	static toOutput(entity: Customer): CustomerOutput {
		return entity.toJSON();
	}
}
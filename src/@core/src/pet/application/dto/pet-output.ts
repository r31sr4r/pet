import { Pet } from "pet/domain/entities/pet";

export type PetOutput = {
	id: string;
	name: string;
    type: string;
    breed: string | null;
    gender: string | null;
    birth_date: Date | null;
	is_active: boolean;
	created_at: Date;
};

export class PetOutputMapper {
	static toOutput(entity: Pet): PetOutput {
		return entity.toJSON();
	}
}
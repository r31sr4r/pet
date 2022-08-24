import { PetOutput } from 'pet-core/pet/application';
import { Transform } from 'class-transformer';

export class PetPresenter {
    id: string;
    name: string;
    type: string;
    breed: string | null;
    gender: string | null;
    birth_date: Date | null;
    is_active: boolean;
    @Transform(({ value }) => value.toISOString(), { toPlainOnly: true })
    created_at: Date;

    constructor(output: PetOutput) {
        this.id = output.id;
        this.name = output.name;
        this.type = output.type;
        this.breed = output.breed;
        this.gender = output.gender;
        this.birth_date = output.birth_date;
        this.is_active = output.is_active;
        this.created_at = output.created_at;
    }
}

import { CustomerOutput } from 'pet-core/customer/application';
import { Transform } from 'class-transformer';

export class CustomerPresenter {
    id: string;
    name: string;
    email: string;
    cellphone: string;
    cpf: string;
    gender: string;
    is_active: boolean;
    @Transform(({ value }) => (value == null ? null : value.toISOString()), {
        toPlainOnly: true,
    })
    birth_date: Date;
    @Transform(({ value }) => value.toISOString(), { toPlainOnly: true })
    created_at: Date;
    @Transform(({ value }) => (value == null ? null : value.toISOString()), {
        toPlainOnly: true,
    })
    updated_at: Date;

    constructor(output: CustomerOutput) {
        this.id = output.id;
        this.name = output.name;
        this.email = output.email;
        this.cellphone = output.cellphone;
        this.cpf = output.cpf;
        this.gender = output.gender;
        this.birth_date = output.birth_date;
        this.is_active = output.is_active;
        this.created_at = output.created_at;
        this.updated_at = output.updated_at;
    }
}

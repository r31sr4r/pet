import { UserOutput } from 'pet-core/user/application';
import { Transform, Exclude } from 'class-transformer';

export class UserPresenter {
    id: string;
    name: string;
    email: string;
    @Exclude()
    password: string;
    is_active: boolean;
    @Transform(({ value }) => value.toISOString(), { toPlainOnly: true })
    created_at: Date;

    constructor(output: UserOutput) {
        this.id = output.id;
        this.name = output.name;
        this.email = output.email;
        this.is_active = output.is_active;
        this.created_at = output.created_at;
    }
}

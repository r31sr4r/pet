import { GroupOutput } from 'pet-core/access/application';
import { Transform } from 'class-transformer';

export class GroupPresenter {
    id: string;
    name: string;    
    description: string | null;    
    is_active: boolean;
    @Transform(({ value }) => value.toISOString(), { toPlainOnly: true })
    created_at: Date;

    constructor(output: GroupOutput) {
        this.id = output.id;
        this.name = output.name;
        this.description = output.description;
        this.is_active = output.is_active;
        this.created_at = output.created_at;
    }
}

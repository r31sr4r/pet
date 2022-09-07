import { UserAssignedToGroupAndRoleOutput } from 'pet-core/access/application';
import { Transform } from 'class-transformer';

export class UsersGroupsRolesPresenter {
    id: string;
    user_id: string;
    group_id: string;
    role_id: string;
    @Transform(({ value }) => value.toISOString(), { toPlainOnly: true })
    created_at: Date;

    constructor(output: UserAssignedToGroupAndRoleOutput) {
        this.id = output.id;
        this.user_id = output.user_id;
        this.group_id = output.group_id;
        this.role_id = output.role_id;
        this.created_at = output.created_at;
    }
}

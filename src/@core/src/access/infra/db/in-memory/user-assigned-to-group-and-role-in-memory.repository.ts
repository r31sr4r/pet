import { SortDirection } from '#seedwork/domain/repository/repository-contracts';
import { InMemorySearchableRepository } from '#seedwork/domain/repository/in-memory.repository';
import { UserAssignedToGroupAndRole } from '../../../domain/entities/user-assigned-to-group-and-role';
import UserAssignedToGroupAndRoleRepository from '../../../domain/repository/user-assigned-to-group-and-role.repository';

export class UserAssignedToGroupAndRoleInMemoryRepository
	extends InMemorySearchableRepository<UserAssignedToGroupAndRole>
	implements UserAssignedToGroupAndRoleRepository.Repository
{
	sortableFields: string[] = ['user_id', 'created_at'];

	protected async applyFilter(
		items: UserAssignedToGroupAndRole[],
		filter: UserAssignedToGroupAndRoleRepository.Filter
	): Promise<UserAssignedToGroupAndRole[]> {
		if (!filter) {
			return items;
		}

		return items.filter((item) => {
			return item.props.user_id.includes(filter);
		});
	}

	protected applySort(
		items: UserAssignedToGroupAndRole[],
		sort: string,
		sort_dir: SortDirection
	): Promise<UserAssignedToGroupAndRole[]> {
		if (!sort) {
			return this.applySort(items, 'created_at', 'desc');
		} else {
			return super.applySort(items, sort, sort_dir);
		}
	}
}

export default UserAssignedToGroupAndRoleInMemoryRepository;

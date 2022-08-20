import { SortDirection } from '#seedwork/domain/repository/repository-contracts';
import { InMemorySearchableRepository } from '#seedwork/domain/repository/in-memory.repository';
import { Role } from '../../../domain/entities/role';
import RoleRepository from '../../../domain/repository/role.repository';

export class RoleInMemoryRepository
	extends InMemorySearchableRepository<Role>
	implements RoleRepository.Repository
{
	sortableFields: string[] = ['name', 'created_at'];

	protected async applyFilter(
		items: Role[],
		filter: RoleRepository.Filter
	): Promise<Role[]> {
		if (!filter) {
			return items;
		}

		return items.filter((item) => {
			return item.props.name.toLowerCase().includes(filter.toLowerCase());
		});
	}

	protected applySort(
		items: Role[],
		sort: string,
		sort_dir: SortDirection
	): Promise<Role[]> {
		if (!sort) {
			return this.applySort(items, 'created_at', 'desc');
		} else {
			return super.applySort(items, sort, sort_dir);
		}
	}
}

export default RoleInMemoryRepository;

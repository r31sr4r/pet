import { SortDirection } from '#seedwork/domain/repository/repository-contracts';
import { InMemorySearchableRepository } from '../../../../@seedwork/domain/repository/in-memory.repository';
import { Group } from '../../../domain/entities/group';
import GroupRepository from '../../../domain/repository/group.repository';

export class GroupInMemoryRepository
	extends InMemorySearchableRepository<Group>
	implements GroupRepository.Repository
{
	sortableFields: string[] = ['name', 'created_at'];

	protected async applyFilter(
		items: Group[],
		filter: GroupRepository.Filter
	): Promise<Group[]> {
		if (!filter) {
			return items;
		}

		return items.filter((item) => {
			return item.props.name.toLowerCase().includes(filter.toLowerCase());
		});
	}

	protected applySort(
		items: Group[],
		sort: string,
		sort_dir: SortDirection
	): Promise<Group[]> {
		if (!sort) {
			return this.applySort(items, 'created_at', 'desc');
		} else {
			return super.applySort(items, sort, sort_dir);
		}
	}
}

export default GroupInMemoryRepository;

import { SortDirection } from '#seedwork/domain/repository/repository-contracts';
import { InMemorySearchableRepository } from '../../../../@seedwork/domain/repository/in-memory.repository';
import { User } from '../../../domain/entities/user';
import UserRepository from '../../../domain/repository/user.repository';

export class UserInMemoryRepository
	extends InMemorySearchableRepository<User>
	implements UserRepository.Repository
{
	sortableFields: string[] = ['name', 'email', 'created_at']

	protected async applyFilter(
		items: User[],
		filter: UserRepository.Filter
	): Promise<User[]> {
		if (!filter) {
			return items;
		}

		return items.filter((item) => {
			return item.props.email.toLowerCase().includes(filter.toLowerCase());
		});
	}

	protected async applySort(
		items: User[],
		sort: string,
		sort_dir: SortDirection
	): Promise<User[]> {
		return !sort 
		? super.applySort(items, 'name', 'asc')
		: super.applySort(items, sort, sort_dir);
	}
}

export default UserInMemoryRepository;
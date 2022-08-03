import { SortDirection } from '#seedwork/domain/repository/repository-contracts';
import { InMemorySearchableRepository } from '../../../@seedwork/domain/repository/in-memory.repository';
import { Pet } from '../../domain/entities/pet';
import PetRepository from '../../domain/repository/pet.repository';

export default class PetInMemoryRepository
	extends InMemorySearchableRepository<Pet>
	implements PetRepository.Repository
{
	sortableFields: string[] = ['name', 'type', 'breed']

	protected async applyFilter(
		items: Pet[],
		filter: PetRepository.Filter
	): Promise<Pet[]> {
		if (!filter) {
			return items;
		}

		return items.filter((item) => {
			return item.props.name.toLowerCase().includes(filter.toLowerCase());
		});
	}

	protected async applySort(
		items: Pet[],
		sort: string,
		sort_dir: SortDirection
	): Promise<Pet[]> {
		return !sort 
		? super.applySort(items, 'name', 'asc')
		: super.applySort(items, sort, sort_dir);
	}
}

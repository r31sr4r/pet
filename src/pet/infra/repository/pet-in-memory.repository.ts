import { InMemorySearchableRepository } from '../../../@seedwork/domain/repository/in-memory.repository';
import { Pet } from '../../domain/entities/pet';
import PetRepository from '../../domain/repository/pet.repository';

export default class PetInMemoryRepository
	extends InMemorySearchableRepository<Pet>
	implements PetRepository.Repository
{
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
}

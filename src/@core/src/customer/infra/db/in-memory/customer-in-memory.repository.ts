import { SortDirection } from '#seedwork/domain/repository/repository-contracts';
import { InMemorySearchableRepository } from '../../../../@seedwork/domain/repository/in-memory.repository';
import { Customer } from '../../../domain/entities/customer';
import CustomerRepository from '../../../domain/repository/customer.repository';

export class CustomerInMemoryRepository
	extends InMemorySearchableRepository<Customer>
	implements CustomerRepository.Repository
{
	sortableFields: string[] = ['name', 'type', 'breed']

	protected async applyFilter(
		items: Customer[],
		filter: CustomerRepository.Filter
	): Promise<Customer[]> {
		if (!filter) {
			return items;
		}

		return items.filter((item) => {
			return item.props.name.toLowerCase().includes(filter.toLowerCase());
		});
	}

	protected async applySort(
		items: Customer[],
		sort: string,
		sort_dir: SortDirection
	): Promise<Customer[]> {
		return !sort 
		? super.applySort(items, 'name', 'asc')
		: super.applySort(items, sort, sort_dir);
	}
}

export default CustomerInMemoryRepository;
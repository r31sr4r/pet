import Entity from '../../entity/entity';
import { InMemorySearchableRepository } from '../in-memory.repository';
import { SearchParams, SearchResult } from '../repository-contracts';

type StubEntityProps = {
	name: string;
	price: number;
};

class StubEntity extends Entity {}

class StubInMemorySearchableRepository extends InMemorySearchableRepository<StubEntity> {
	sortableFields: string[] = ['name'];

	protected async applyFilter(
		items: StubEntity[],
		filter: string | null
	): Promise<StubEntity[]> {
		if (!filter) {
			return items;
		}
		return items.filter((item) => {
			return (
				item.props.name.toLowerCase().includes(filter.toLowerCase()) ||
				item.props.price.toString() === filter
			);
		});
	}
}

describe('InMemorySearchableRepository Unit Tests', () => {
	let repository: StubInMemorySearchableRepository;
	beforeEach(() => (repository = new StubInMemorySearchableRepository()));

	describe('applyFilter method', () => {
		it('should return all entities when filter is null', async () => {
			const items = [
				new StubEntity({ name: 'some name', price: 10 }),
				new StubEntity({ name: 'other name', price: 5 }),
			];
			const spyFilterMethod = jest.spyOn(items, 'filter' as any);
			const filterdItems = await repository['applyFilter'](items, null);
			expect(filterdItems).toStrictEqual(items);
			expect(spyFilterMethod).not.toHaveBeenCalled();
		});

		it('shoult return filtered items when filter is not null', async () => {
			const items = [
				new StubEntity({ name: 'some name', price: 10 }),
				new StubEntity({ name: 'SOME other name', price: 10 }),
				new StubEntity({ name: 'other name', price: 5 }),
				new StubEntity({ name: 'NAME', price: 0 }),
			];
			const spyFilterMethod = jest.spyOn(items, 'filter' as any);
			let filterdItems = await repository['applyFilter'](items, 'some');
			expect(filterdItems).toStrictEqual([items[0], items[1]]);
			expect(spyFilterMethod).toHaveBeenCalledTimes(1);

			filterdItems = await repository['applyFilter'](items, '5');
			expect(filterdItems).toStrictEqual([items[2]]);
			expect(spyFilterMethod).toHaveBeenCalledTimes(2);

			filterdItems = await repository['applyFilter'](items, 'no-filter');
			expect(filterdItems).toHaveLength(0);
			expect(spyFilterMethod).toHaveBeenCalledTimes(3);
		});
	});

	describe('applySort method', () => {
		it('should return all entities without sort when sort is null', async () => {
			const items = [
				new StubEntity({ name: 'some name', price: 10 }),
				new StubEntity({ name: 'other name', price: 5 }),
			];
			let sortedItems = await repository['applySort'](items, null, null);
			expect(sortedItems).toStrictEqual(items);

			sortedItems = await repository['applySort'](items, 'price', 'asc');
			expect(sortedItems).toStrictEqual(items);
		});

		it('should return sorted items when sort is not null', async () => {
			const items = [
				new StubEntity({ name: 'some name', price: 10 }),
				new StubEntity({ name: 'some other name', price: 10 }),
				new StubEntity({ name: 'other name', price: 5 }),
				new StubEntity({ name: 'name', price: 0 }),
			];
			let sortedItems = await repository['applySort'](
				items,
				'name',
				'asc'
			);
			expect(sortedItems).toStrictEqual([
				items[3],
				items[2],
				items[0],
				items[1],
			]);

			sortedItems = await repository['applySort'](items, 'name', 'desc');
			expect(sortedItems).toStrictEqual([
				items[1],
				items[0],
				items[2],
				items[3],
			]);
		});
	});

	describe('applyPaginate method', () => {
		it('should return paginated items', async () => {
			const items = [
				new StubEntity({ name: 'some name', price: 10 }),
				new StubEntity({ name: 'other name', price: 5 }),
				new StubEntity({ name: 'some other name', price: 10 }),
				new StubEntity({ name: 'name', price: 0 }),
				new StubEntity({ name: 'some test', price: 4 }),
			];
			let paginatedItems = await repository['applyPaginate'](items, 1, 2);
			expect(paginatedItems).toStrictEqual([items[0], items[1]]);

			paginatedItems = await repository['applyPaginate'](items, 2, 2);
			expect(paginatedItems).toStrictEqual([items[2], items[3]]);
		});

		it('should return empty array when page is out of range', async () => {
			const items = [
				new StubEntity({ name: 'some name', price: 10 }),
				new StubEntity({ name: 'other name', price: 5 }),
				new StubEntity({ name: 'some other name', price: 10 }),
				new StubEntity({ name: 'name', price: 0 }),
				new StubEntity({ name: 'some test', price: 4 }),
			];
			let paginatedItems = await repository['applyPaginate'](items, 0, 2);
			expect(paginatedItems).toStrictEqual([]);

			paginatedItems = await repository['applyPaginate'](items, 4, 2);
			expect(paginatedItems).toStrictEqual([]);
		});
	});

	describe('search method', () => {
		it('should apply only paginate when other params are null', async () => {
			const entity = new StubEntity({ name: 'some name', price: 10 });
			const items = Array(16).fill(entity);
			repository.items = items;

			const result = await repository.search(new SearchParams());

			expect(result).toStrictEqual(
				new SearchResult({
					items: Array(15).fill(entity),
					total: 16,
					current_page: 1,
					per_page: 15,
					sort: null,
					sort_dir: null,
					filter: null,
				})
			);
		});

		it('should apply paginate and filter', async () => {
			const items = [
				new StubEntity({ name: 'some name', price: 10 }),
				new StubEntity({ name: 'other name', price: 5 }),
				new StubEntity({ name: 'some other name', price: 10 }),
				new StubEntity({ name: 'name', price: 0 }),
				new StubEntity({ name: 'some test', price: 4 }),
			];
			repository.items = items;

			let result = await repository.search(
				new SearchParams({
					page: 1,
					per_page: 2,
					filter: 'some',
				})
			);
			
			expect(result).toStrictEqual(
				new SearchResult({
					items: [items[0], items[2]],
					total: 3,
					current_page: 1,
					per_page: 2,
					sort: null,
					sort_dir: null,
					filter: 'some',
				})
			);

			result = await repository.search(
				new SearchParams({
					page: 2,
					per_page: 2,
					filter: 'some',
				})
			);

			expect(result).toStrictEqual(
				new SearchResult({
					items: [items[4]],
					total: 3,
					current_page: 2,
					per_page: 2,
					sort: null,
					sort_dir: null,
					filter: 'some',
				})
			);
		});

		it('should apply paginate and sort', async () => {
			const items = [
				new StubEntity({ name: 'some name', price: 10 }),
				new StubEntity({ name: 'other name', price: 5 }),
				new StubEntity({ name: 'some other name', price: 10 }),
				new StubEntity({ name: 'name', price: 0 }),
				new StubEntity({ name: 'some test', price: 4 }),
			];
			repository.items = items;

			const arrange = [
				{
					params: new SearchParams({
						page: 1,
						per_page: 2,
						sort: 'name',
					}),
					result: new SearchResult({
						items: [items[3], items[1]],
						total: 5,
						current_page: 1,
						per_page: 2,
						sort: 'name',
						sort_dir: 'asc',
						filter: null,
					}),
				},
				{
					params: new SearchParams({
						page: 2,
						per_page: 2,
						sort: 'name',
					}),
					result: new SearchResult({
						items: [items[0], items[2]],
						total: 5,
						current_page: 2,
						per_page: 2,
						sort: 'name',
						sort_dir: 'asc',
						filter: null,
					}),
				},
				{
					params: new SearchParams({
						page: 1,
						per_page: 2,
						sort: 'name',
						sort_dir: 'desc',
					}),
					result: new SearchResult({
						items: [items[4], items[2]],
						total: 5,
						current_page: 1,
						per_page: 2,
						sort: 'name',
						sort_dir: 'desc',
						filter: null,
					}),
				},
				{
					params: new SearchParams({
						page: 2,
						per_page: 2,
						sort: 'name',
						sort_dir: 'desc',
					}),
					result: new SearchResult({
						items: [items[0], items[1]],
						total: 5,
						current_page: 2,
						per_page: 2,
						sort: 'name',
						sort_dir: 'desc',
						filter: null,
					}),
				},
			];

			for (const i of arrange) {
				let result = await repository.search(i.params);
				expect(result).toStrictEqual(i.result);
			}
		});

		it('should apply paginate, sort and filter', async () => {
			const items = [
				new StubEntity({ name: 'some name', price: 10 }),
				new StubEntity({ name: 'other name', price: 5 }),
				new StubEntity({ name: 'some other name', price: 10 }),
				new StubEntity({ name: 'name', price: 0 }),
				new StubEntity({ name: 'some test', price: 4 }),
			];
			repository.items = items;

			const arrange = [
				{
					params: new SearchParams({
						page: 1,
						per_page: 2,
						sort: 'name',
						filter: 'some',
					}),
					result: new SearchResult({
						items: [items[0], items[2]],
						total: 3,
						current_page: 1,
						per_page: 2,
						sort: 'name',
						sort_dir: 'asc',
						filter: 'some',
					}),
				},
				{
					params: new SearchParams({
						page: 2,
						per_page: 2,
						sort: 'name',
						filter: 'some',
					}),
					result: new SearchResult({
						items: [items[4]],
						total: 3,
						current_page: 2,
						per_page: 2,
						sort: 'name',
						sort_dir: 'asc',
						filter: 'some',
					}),
				},
				{
					params: new SearchParams({
						page: 1,
						per_page: 2,
						sort: 'name',
						sort_dir: 'desc',
						filter: 'some',
					}),
					result: new SearchResult({
						items: [items[4], items[2]],
						total: 3,
						current_page: 1,
						per_page: 2,
						sort: 'name',
						sort_dir: 'desc',
						filter: 'some',
					}),
				},
			];

			for (const i of arrange) {
				let result = await repository.search(i.params);
				expect(result).toStrictEqual(i.result);
			}
		});
	});
});

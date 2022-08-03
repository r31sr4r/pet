import { SearchParams, SearchResult } from '../repository-contracts';
describe('RepositoryContracts Unit Tests', () => {
	describe('SearchParams Unit Tests', () => {
		test('page prop', () => {
			const params = new SearchParams();
			expect(params.page).toBe(1);

			const arrange = [
				{ page: 0, expected: 1 },
				{ page: -1, expected: 1 },
				{ page: 5.5, expected: 1 },
				{ page: true, expected: 1 },
				{ page: {}, expected: 1 },
				{ page: '', expected: 1 },
				{ page: 'a', expected: 1 },
				{ page: null, expected: 1 },
				{ page: undefined, expected: 1 },
				{ page: 1, expected: 1 },
				{ page: 2, expected: 2 },
			];

			arrange.forEach((arr) => {
				expect(new SearchParams({ page: arr.page as any }).page).toBe(
					arr.expected
				);
			});
		});

		test('per_page prop', () => {
			const params = new SearchParams();
			expect(params.per_page).toBe(15);

			const arrange = [
				{ per_page: 0, expected: 15 },
				{ per_page: -1, expected: 15 },
				{ per_page: 5.5, expected: 15 },
				{ per_page: true, expected: 15 },
				{ per_page: {}, expected: 15 },
				{ per_page: '', expected: 15 },
				{ per_page: 'a', expected: 15 },
				{ per_page: null, expected: 15 },
				{ per_page: undefined, expected: 15 },
				{ per_page: 1, expected: 1 },
				{ per_page: 2, expected: 2 },
				{ per_page: 10, expected: 10 },
			];

			arrange.forEach((arr) => {
				expect(
					new SearchParams({ per_page: arr.per_page as any }).per_page
				).toBe(arr.expected);
			});
		});

		test('sort prop', () => {
			const params = new SearchParams();
			expect(params.sort).toBe(null);

			const arrange = [
				{ sort: null, expected: null },
				{ sort: undefined, expected: null },
				{ sort: 0, expected: '0' },
				{ sort: -1, expected: '-1' },
				{ sort: 5.5, expected: '5.5' },
				{ sort: true, expected: 'true' },
				{ sort: {}, expected: '[object Object]' },
				{ sort: '', expected: null },
				{ sort: 'a', expected: 'a' },
				{ sort: 'field', expected: 'field' },
			];

			arrange.forEach((arr) => {
				expect(new SearchParams({ sort: arr.sort as any }).sort).toBe(
					arr.expected
				);
			});
		});

		test('sort_dir prop', () => {
			let params = new SearchParams();
			expect(params.sort_dir).toBe(null);

			params = new SearchParams({ sort: null });
			expect(params.sort_dir).toBe(null);

			params = new SearchParams({ sort: undefined });
			expect(params.sort_dir).toBe(null);

			params = new SearchParams({ sort: '' });
			expect(params.sort_dir).toBe(null);

			const arrange = [
				{ sort_dir: null, expected: 'asc' },
				{ sort_dir: undefined, expected: 'asc' },
				{ sort_dir: '', expected: 'asc' },
				{ sort_dir: 0, expected: 'asc' },
				{ sort_dir: 'fake', expected: 'asc' },
				{ sort_dir: 'asc', expected: 'asc' },
				{ sort_dir: 'ASC', expected: 'asc' },
				{ sort_dir: 'desc', expected: 'desc' },
				{ sort_dir: 'DESC', expected: 'desc' },
			];

			arrange.forEach((arr) => {
				expect(
					new SearchParams({
						sort: 'field',
						sort_dir: arr.sort_dir as any,
					}).sort_dir
				).toBe(arr.expected);
			});
		});

		test('filter prop', () => {
			const params = new SearchParams();
			expect(params.filter).toBe(null);

			const arrange = [
				{ fields: null, expected: null },
				{ fields: undefined, expected: null },
				{ fields: '', expected: null },
				{ fields: 0, expected: '0' },
				{ fields: -1, expected: '-1' },
				{ fields: 5.5, expected: '5.5' },
				{ fields: true, expected: 'true' },
				{ fields: {}, expected: '[object Object]' },
				{ fields: 'a', expected: 'a' },
				{ fields: 'field', expected: 'field' },
			];

			arrange.forEach((arr) => {
				expect(
					new SearchParams({ filter: arr.fields as any }).filter
				).toBe(arr.expected);
			});
		});
	});

	describe('SearchResult Unit Tests', () => {
		test('constructor props', () => {
			let result = new SearchResult({
				items: ['entity1', 'entity2'] as any,
				total: 4,
				current_page: 1,
				per_page: 2,
				sort: null,
				sort_dir: null,
				filter: null,
			});

			expect(result.toJSON()).toStrictEqual({
				items: ['entity1', 'entity2'],
				total: 4,
				current_page: 1,
				per_page: 2,
				last_page: 2,
				sort: null,
				sort_dir: null,
				filter: null,
			});

			result = new SearchResult({
				items: ['entity1', 'entity2'] as any,
				total: 4,
				current_page: 1,
				per_page: 2,
				sort: 'name',
				sort_dir: 'asc',
				filter: 'test' as any,
			});

			expect(result.toJSON()).toStrictEqual({
				items: ['entity1', 'entity2'],
				total: 4,
				current_page: 1,
				per_page: 2,
				last_page: 2,
				sort: 'name',
				sort_dir: 'asc',
				filter: 'test',
			});
		});

		it('should set last_page 1 when per_page field is greater than total', () => {
			const result = new SearchResult({
				items: ['entity1', 'entity2'] as any,
				total: 4,
				current_page: 1,
				per_page: 10,
				sort: 'name',
				sort_dir: 'asc',
				filter: 'test',
			});

			expect(result.last_page).toBe(1);

			expect(result.toJSON()).toStrictEqual({
				items: ['entity1', 'entity2'],
				total: 4,
				current_page: 1,
				per_page: 10,
				last_page: 1,
				sort: 'name',
				sort_dir: 'asc',
				filter: 'test',
			});
		});

		test('last_page prop when total is not a multiple of per_page', () => {
			const result = new SearchResult({
				items: [] as any,
				total: 101,
				current_page: 1,
				per_page: 20,
				sort: 'name',
				sort_dir: 'asc',
				filter: 'test',
			});

            expect(result.last_page).toBe(6);
		});
	});
});

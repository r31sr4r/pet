import { SearchResult } from '../../domain/repository/repository-contracts';
import { PaginationOutputMapper } from './pagination-output';

describe('PaginationOutput Unit Tests', () => {
	describe('PaginationOutputMapper Unit Tests', () => {
		it('should convert a SearchResult to output', () => {
			const result = new SearchResult({
				items: ['fake'] as any,
				total: 1,
				current_page: 1,
				per_page: 2,
				sort: 'name',
				sort_dir: 'asc',
				filter: 'fake',
			});

			const output = PaginationOutputMapper.toOutput(result);

			expect(output).toStrictEqual({
				total: 1,
				current_page: 1,
				last_page: 1,
				per_page: 2,
			});
		});
	});
});

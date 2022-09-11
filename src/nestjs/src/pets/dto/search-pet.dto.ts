import { ListPetsUseCase } from 'pet-core/pet/application';
import { SortDirection } from 'pet-core/dist/@seedwork/domain/repository/repository-contracts';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchPetDto implements ListPetsUseCase.Input {
    @ApiPropertyOptional({
        type: String,
        description: 'Return a specific page of results set (default: 1)',
    })
    page?: number;

    @ApiPropertyOptional({
        type: String,
        description: 'Items per page',
    })
    per_page?: number;

    @ApiPropertyOptional({
        type: String,
        description: 'Sort by field',
    })    
    sort?: string;

    @ApiPropertyOptional({
        type: String,
        description: 'Sort direction (asc, desc)',
    })
    sort_dir?: SortDirection;

    @ApiPropertyOptional({
        type: String,
        description: 'Search by name',
    })
    filter?: string;
}

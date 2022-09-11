import { CreatePetUseCase } from 'pet-core/pet/application';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

export class CreatePetDto implements CreatePetUseCase.Input { 
    
    @ApiProperty({
        type: String,
        description: 'Pet name',
    })
    name: string;

    @ApiPropertyOptional({
        type: String,
        description: 'Pet type. Example: dog, cat, etc.',
    })
    type: string;

    @ApiPropertyOptional({
        type: String,
        description: 'The breed of the pet',
    })
    breed?: string;

    @ApiPropertyOptional({
        type: String,
        description: 'The gender of the pet. Valid values: Male, Female',
    })    
    gender?: string;

    @ApiPropertyOptional({
        type: Date,
        description: 'The birthdate of the pet',
    })    
    birth_date?: Date;

    @ApiPropertyOptional({
        type: Boolean,
        description: 'The status of the pet. Valid values: true, false',
    })
    is_active?: boolean;

    @ApiProperty({
        type: String,
        description: 'The uuid of owner of the pet',
    })
    customer_id: string;
}

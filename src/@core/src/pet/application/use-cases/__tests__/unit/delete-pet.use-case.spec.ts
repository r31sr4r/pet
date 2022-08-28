import { Pet } from '../../../../domain/entities/pet';
import NotFoundError from '../../../../../@seedwork/domain/errors/not-found.error';
import PetInMemoryRepository from '../../../../infra/db/in-memory/pet-in-memory.repository';
import { DeletePetUseCase } from '../../delete-pet.use-case';

describe('DeletePetUseCase Unit Tests', () => {
    let repository: PetInMemoryRepository;
    let useCase: DeletePetUseCase.UseCase;

    beforeEach(() => {
        repository = new PetInMemoryRepository();
        useCase = new DeletePetUseCase.UseCase(repository);
    });

    it('should throw an error when pet not found', async () => {
        await expect(useCase.execute({ id: 'fake id' })).rejects.toThrow(
            new NotFoundError('Entity not found using ID fake id')
        );
    });

    it('should delete a pet', async () => {
        const spyDelete = jest.spyOn(repository, 'delete');
        let items = [
            new Pet({
                name: 'Test Pet',
                type: 'Dog',                
                customer_id: 'f7e4835f-311e-47f2-aa44-908c89649ebe',
            }),
        ];
        repository.items = items;
        await useCase.execute({ id: items[0].id });
        expect(spyDelete).toHaveBeenCalledTimes(1);
        expect(repository.items.length).toBe(0);
    });

});
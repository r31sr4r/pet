import { Pet } from '../../../domain/entities/pet';
import NotFoundError from '../../../../@seedwork/domain/errors/not-found.error';
import PetInMemoryRepository from '../../../infra/repository/pet-in-memory.repository';
import { DeletePetUseCase } from '../delete-pet.use-case';

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
            }),
        ];
        repository.items = items;
        await useCase.execute({ id: items[0].id });
        expect(spyDelete).toHaveBeenCalledTimes(1);
        expect(repository.items.length).toBe(0);
    });

});
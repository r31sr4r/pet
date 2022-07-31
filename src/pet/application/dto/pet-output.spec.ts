import { Pet } from "../../domain/entities/pet";
import { PetOutputMapper } from "./pet-output";

describe('PetOutput Unit Tests', () => {
    describe('PetOutputMapper Unit Tests', () => {
        it('should convert a pet to output', () => {
            const created_at = new Date();
            const pet = new Pet({
                name: 'Pet 1',
                type: 'dog',
                breed: 'breed 1',
                gender: 'Female',
                birth_date: new Date('2022-04-02'),
                is_active: true,
                created_at
            });

            const spyToJSON = jest.spyOn(pet, 'toJSON');
            const output = PetOutputMapper.toOutput(pet);

            expect(spyToJSON).toHaveBeenCalled();
            expect(output).toStrictEqual({
                id: pet.id,
                name: 'Pet 1',
                type: 'dog',
                breed: 'breed 1',
                gender: 'Female',
                birth_date: pet.birth_date,
                is_active: true,
                created_at
            });
        });
    });
});
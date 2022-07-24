import InvalidUuidError from '../errors/invalid-uuid.error';
import UniqueEntityId from './unique-entity-id.vo';
import { validate as uuidValidate  } from 'uuid';

describe('UniqueEntityId Unit Tests', () => {

    const validateSpy = jest.spyOn(UniqueEntityId.prototype as any, 'validate');

    it('should throw error when id is not a valid uuid', () => {        
        expect(() => new UniqueEntityId('fake id'))
            .toThrow(new InvalidUuidError());
        expect(validateSpy).toHaveBeenCalled();
    });

    it('shoul accept a uuid passed in constructor', () => {        
        const uuid = '02b090cf-5658-4073-b242-9bf64915b3ad'
        const vo = new UniqueEntityId(uuid);
        expect(vo.id).toBe(uuid);
        expect(validateSpy).toHaveBeenCalled();

    });

    it('should generate a uuid when no id is passed in constructor', () => {        
        const vo = new UniqueEntityId();
        expect(uuidValidate(vo.id)).toBeTruthy();
        expect(validateSpy).toHaveBeenCalled();
    });
});
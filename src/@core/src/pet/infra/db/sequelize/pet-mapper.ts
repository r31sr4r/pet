import { Pet } from '#pet/domain';
import {
	UniqueEntityId,
	EntityValidationError,
	LoadEntityError,
} from '#seedwork/domain';
import { PetModel } from './pet-model';

export class PetModelMapper {
	static toEntity(model: PetModel): Pet {
		const { id, ...otherData } = model.toJSON();

		try {
			return new Pet(otherData, new UniqueEntityId(id));
		} catch (e) {
			if (e instanceof EntityValidationError) {
				throw new LoadEntityError(e.error);
			}

			throw e;
		}
	}
}

export default PetModelMapper;

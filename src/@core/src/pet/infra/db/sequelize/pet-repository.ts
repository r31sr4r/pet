import { Pet, PetRepository } from '#pet/domain';
import { NotFoundError, UniqueEntityId } from '#seedwork/domain';
import PetModelMapper from './pet-mapper';
import { PetModel } from './pet-model';

export class PetSequelizeRepository implements PetRepository.Repository {
	constructor(private petModel: typeof PetModel) {}

	sortableFields: string[] = ['name', 'created_at'];

	search(
		props: PetRepository.SearchParams
	): Promise<PetRepository.SearchResult> {
		throw new Error('Method not implemented.');
	}

	async insert(entity: Pet): Promise<void> {
		await this.petModel.create(entity.toJSON());
	}

	async findById(id: string | UniqueEntityId): Promise<Pet> {
        const _id = `${id}`;
		const model = await this._get(_id);
		return PetModelMapper.toEntity(model);
	}
	
	async findAll(): Promise<Pet[]> {
		const models = await this.petModel.findAll();
		return models.map(PetModelMapper.toEntity);	
	}
	update(entity: Pet): Promise<void> {
		throw new Error('Method not implemented.');
	}
	delete(id: string | UniqueEntityId): Promise<void> {
		throw new Error('Method not implemented.');
	}

    private async _get(id: string): Promise<PetModel> {
		return this.petModel.findByPk(id, {
			rejectOnEmpty: new NotFoundError(`Entity not found using ID ${id}`),
		});
	}
}

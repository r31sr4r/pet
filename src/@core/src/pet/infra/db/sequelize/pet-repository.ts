import { Pet, PetRepository } from '#pet/domain';
import { NotFoundError, UniqueEntityId } from '#seedwork/domain';
import { Op } from 'sequelize';
import PetModelMapper from './pet-mapper';
import { PetModel } from './pet-model';

export class PetSequelizeRepository implements PetRepository.Repository {
	constructor(private petModel: typeof PetModel) {}

	sortableFields: string[] = ['name', 'type', 'breed']

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

	async search(
		props: PetRepository.SearchParams
	): Promise<PetRepository.SearchResult> {
		const offset = (props.page - 1) * props.per_page;
		const limit = props.per_page;
		const { rows: models, count } =
			await this.petModel.findAndCountAll({
				...(props.filter && {
					where: { name: { [Op.like]: `%${props.filter}%` } },
				}),
				...(props.sort && this.sortableFields.includes(props.sort)
					? { order: [[props.sort, props.sort_dir]] }
					: { order: [['name', 'ASC']] }),
				offset,
				limit,
			});
		return new PetRepository.SearchResult({
			items: models.map((m) => PetModelMapper.toEntity(m)),
			current_page: props.page,
			per_page: props.per_page,
			total: count,
			filter: props.filter,
			sort: props.sort,
			sort_dir: props.sort_dir,
		});
	}	
}

import {
	Column,
	DataType,
	PrimaryKey,
	Table,
	Model,
} from 'sequelize-typescript';
import { SequelizeModelFactory } from '#seedwork/infra';
import { Pet, PetRepository } from '#pet/domain';
import {
	NotFoundError,
	UniqueEntityId,
	EntityValidationError,
	LoadEntityError,
} from '#seedwork/domain';
import { Op } from 'sequelize';

export namespace PetSequelize {
	type PetModelProps = {
		id: string;
		name: string;
		type: string;
		breed: string;
		gender: string;
		birth_date: Date;
		is_active: boolean;
		created_at: Date;
	};

	@Table({ tableName: 'pets', timestamps: false })
	export class PetModel extends Model<PetModelProps> {
		@PrimaryKey
		@Column({ type: DataType.UUID })
		declare id: string;

		@Column({ allowNull: false, type: DataType.STRING(100) })
		declare name: string;

		@Column({ allowNull: false, type: DataType.STRING(50) })
		declare type: string;

		@Column({ allowNull: true, type: DataType.STRING(50) })
		declare breed: string | null;

		@Column({ allowNull: true, type: DataType.STRING(50) })
		declare gender: string | null;

		@Column({ allowNull: true, type: DataType.DATE })
		declare birth_date: Date | null;

		@Column({ allowNull: false, type: DataType.BOOLEAN })
		declare is_active: boolean;

		@Column({ allowNull: false, type: DataType.DATE })
		declare created_at: Date;

		static factory() {
			const chance: Chance.Chance = require('chance')();
			return new SequelizeModelFactory<PetModel, PetModelProps>(
				PetModel,
				() => ({
					id: chance.guid({ version: 4 }),
					name: chance.name(),
					type: chance.animal({ type: 'pet' }),
					breed: chance.word({ syllables: 3 }),
					gender: chance.gender(),
					birth_date: chance.birthday(),
					is_active: chance.bool(),
					created_at: chance.date(),
				})
			);
		}
	}

	export class PetSequelizeRepository implements PetRepository.Repository {
		constructor(private petModel: typeof PetModel) {}

		sortableFields: string[] = ['name', 'type', 'breed'];

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
				rejectOnEmpty: new NotFoundError(
					`Entity not found using ID ${id}`
				),
			});
		}

		async search(
			props: PetRepository.SearchParams
		): Promise<PetRepository.SearchResult> {
			const offset = (props.page - 1) * props.per_page;
			const limit = props.per_page;
			const { rows: models, count } = await this.petModel.findAndCountAll(
				{
					...(props.filter && {
						where: { name: { [Op.like]: `%${props.filter}%` } },
					}),
					...(props.sort && this.sortableFields.includes(props.sort)
						? { order: [[props.sort, props.sort_dir]] }
						: { order: [['name', 'ASC']] }),
					offset,
					limit,
				}
			);
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
}

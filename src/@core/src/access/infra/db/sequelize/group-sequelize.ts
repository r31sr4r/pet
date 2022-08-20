import {
	Column,
	DataType,
	PrimaryKey,
	Table,
	Model,
} from 'sequelize-typescript';
import { SequelizeModelFactory } from '../../../../@seedwork/infra/sequelize/sequelize-model-factory';
import { Group, GroupRepository } from '#access/domain/index';
import { Op } from 'sequelize';
import {
	NotFoundError,
	UniqueEntityId,
	EntityValidationError,
	LoadEntityError,
} from '#seedwork/domain';

export namespace GroupSequelize {
	type GroupModelProps = {
		id: string;
		name: string;
		description: string;
		is_active: boolean;
		created_at: Date;
	};

	@Table({ tableName: 'groups', timestamps: false })
	export class GroupModel extends Model<GroupModelProps> {
		@PrimaryKey
		@Column({ type: DataType.UUID })
		declare id: string;

		@Column({ allowNull: false, type: DataType.STRING(255) })
		declare name: string;

		@Column({ allowNull: false, type: DataType.TEXT })
		declare description: string | null;

		@Column({ allowNull: false, type: DataType.BOOLEAN })
		declare is_active: boolean;

		@Column({ allowNull: false, type: DataType.DATE })
		declare created_at: Date;

		static factory() {
			const chance: Chance.Chance = require('chance')();
			return new SequelizeModelFactory<GroupModel, GroupModelProps>(
				GroupModel,
				() => ({
					id: chance.guid({ version: 4 }),
					name: chance.word({ length: 10 }),
					description: chance.paragraph(),
					is_active: true,
					created_at: chance.date(),
				})
			);
		}
	}

	export class GroupSequelizeRepository
		implements GroupRepository.Repository
	{
		sortableFields: string[] = ['name', 'created_at'];

		constructor(private groupModel: typeof GroupModel) {}

		async exists(_name: string): Promise<boolean> {
			const count = await this.groupModel.count({
				where: { name: _name },
			});
			return count > 0;
		}

		async insert(entity: Group): Promise<void> {
			await this.groupModel.create(entity.toJSON());
		}

		async findById(id: string | UniqueEntityId): Promise<Group> {
			const _id = `${id}`;
			const model = await this._get(_id);
			return GroupModelMapper.toEntity(model);
		}

		async findAll(): Promise<Group[]> {
			const models = await this.groupModel.findAll();
			return models.map((m) => GroupModelMapper.toEntity(m));
		}

		async update(entity: Group): Promise<void> {
			await this._get(entity.id);
			await this.groupModel.update(entity.toJSON(), {
				where: { id: entity.id },
			});
		}

		async delete(id: string | UniqueEntityId): Promise<void> {
			const _id = `${id}`;
			await this._get(_id);
			await this.groupModel.destroy({ where: { id: _id } });
		}

		private async _get(id: string): Promise<GroupModel> {
			return this.groupModel.findByPk(id, {
				rejectOnEmpty: new NotFoundError(
					`Entity not found using ID ${id}`
				),
			});
		}

		async search(
			props: GroupRepository.SearchParams
		): Promise<GroupRepository.SearchResult> {
			const offset = (props.page - 1) * props.per_page;
			const limit = props.per_page;
			const { rows: models, count } =
				await this.groupModel.findAndCountAll({
					...(props.filter && {
						where: { name: { [Op.like]: `%${props.filter}%` } },
					}),
					...(props.sort && this.sortableFields.includes(props.sort)
						? { order: [[props.sort, props.sort_dir]] }
						: { order: [['created_at', 'DESC']] }),
					offset,
					limit,
				});
			return new GroupRepository.SearchResult({
				items: models.map((m) => GroupModelMapper.toEntity(m)),
				current_page: props.page,
				per_page: props.per_page,
				total: count,
				filter: props.filter,
				sort: props.sort,
				sort_dir: props.sort_dir,
			});
		}
	}

	export class GroupModelMapper {
		static toEntity(model: GroupModel): Group {
			const { id, ...otherData } = model.toJSON();

			try {
				return new Group(otherData, new UniqueEntityId(id));
			} catch (e) {
				if (e instanceof EntityValidationError) {
					throw new LoadEntityError(e.error);
				}

				throw e;
			}
		}
	}
}

import {
	Column,
	DataType,
	PrimaryKey,
	Table,
	Model,
} from 'sequelize-typescript';
import { SequelizeModelFactory } from '#seedwork/infra/sequelize/index';
import { User, UserRepository } from '#user/domain/index';
import {
	NotFoundError,
	UniqueEntityId,
	EntityValidationError,
	LoadEntityError,
} from '#seedwork/domain/index';
import { Op } from 'sequelize';

export namespace UserSequelize {
	type UserModelProps = {
		id: string;
		name: string;
		email: string;
		password: string;		
		is_active: boolean;
		created_at: Date;
	};

	@Table({ tableName: 'users', timestamps: false })
	export class UserModel extends Model<UserModelProps> {
		@PrimaryKey
		@Column({ type: DataType.UUID })
		declare id: string;

		@Column({ allowNull: false, type: DataType.STRING(255) })
		declare name: string;

		@Column({ allowNull: false, type: DataType.STRING(255) })
		declare email: string;

		@Column({ allowNull: false, type: DataType.STRING() })
		declare password: string;

		@Column({ allowNull: false, type: DataType.BOOLEAN })
		declare is_active: boolean;

		@Column({ allowNull: false, type: DataType.DATE })
		declare created_at: Date;

		static factory() {
			const chance: Chance.Chance = require('chance')();
			return new SequelizeModelFactory<UserModel, UserModelProps>(
				UserModel,
				() => ({
					id: chance.guid({ version: 4 }),
					name: chance.name(),
					email: chance.email(),
					password: 'SomePassword#123',
					is_active: chance.bool(),
					created_at: chance.date(),
				})
			);
		}
	}

	export class UserSequelizeRepository implements UserRepository.Repository {
		constructor(private userModel: typeof UserModel) {}

		sortableFields: string[] = ['name', 'email', 'created_at'];

		async insert(entity: User): Promise<void> {
			await this.userModel.create(entity.toJSON());
		}

		async findById(id: string | UniqueEntityId): Promise<User> {
			const _id = `${id}`;
			const model = await this._get(_id);
			return UserModelMapper.toEntity(model);
		}

		async findAll(): Promise<User[]> {
			const models = await this.userModel.findAll();
			return models.map(UserModelMapper.toEntity);
		}

		async update(entity: User): Promise<void> {
			await this._get(entity.id);
			await this.userModel.update(entity.toJSON(), {
				where: { id: entity.id },
			});
		}

		async updatePassword(id: string | UniqueEntityId, password: string): Promise<void> {
			const _id = `${id}`;
			const model = await this._get(_id);
			model.password = password;
			await model.save();
		}

		async delete(id: string | UniqueEntityId): Promise<void> {
			const _id = `${id}`;
			await this._get(_id);
			await this.userModel.destroy({ where: { id: _id } });
		}

		private async _get(id: string): Promise<UserModel> {
			return this.userModel.findByPk(id, {
				rejectOnEmpty: new NotFoundError(
					`Entity not found using ID ${id}`
				),
			});
		}

		async search(
			props: UserRepository.SearchParams
		): Promise<UserRepository.SearchResult> {
			const offset = (props.page - 1) * props.per_page;
			const limit = props.per_page;
			const { rows: models, count } = await this.userModel.findAndCountAll(
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
			return new UserRepository.SearchResult({
				items: models.map((m) => UserModelMapper.toEntity(m)),
				current_page: props.page,
				per_page: props.per_page,
				total: count,
				filter: props.filter,
				sort: props.sort,
				sort_dir: props.sort_dir,
			});
		}
	}

	export class UserModelMapper {
		static toEntity(model: UserModel): User {
			const { id, ...otherData } = model.toJSON();

			try {
				return new User(otherData, new UniqueEntityId(id), true);
			} catch (e) {
				if (e instanceof EntityValidationError) {
					throw new LoadEntityError(e.error);
				}

				throw e;
			}
		}
	}
}

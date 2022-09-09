import {
	Column,
	DataType,
	PrimaryKey,
	Table,
	Model,
	HasMany,
} from 'sequelize-typescript';
import { SequelizeModelFactory } from '#seedwork/infra/sequelize/index';
import { Customer, CustomerRepository } from '#customer/domain/index';
import {
	NotFoundError,
	UniqueEntityId,
	EntityValidationError,
	LoadEntityError,
} from '#seedwork/domain/index';
import { Op } from 'sequelize';
import { Pet } from '#pet/domain';
import { PetSequelize } from '#pet/infra';

export namespace CustomerSequelize {
	type CustomerModelProps = {
		id: string;
		name: string;
		email: string;
		cellphone: string;
		cpf: string;
		gender: string;
		birth_date: Date;
		is_active: boolean;
		pets: Pet[];
		created_at: Date;
		updated_at: Date;
	};

	@Table({ tableName: 'customers', timestamps: false })
	export class CustomerModel extends Model<CustomerModelProps> {
		@PrimaryKey
		@Column({ type: DataType.UUID })
		declare id: string;

		@Column({ allowNull: false, type: DataType.STRING(255) })
		declare name: string;

		@Column({ unique: true, allowNull: false, type: DataType.STRING(255) })
		declare email: string;

		@Column({ allowNull: true, type: DataType.STRING(15) })
		declare cellphone: string | null;

		@Column({ allowNull: true, type: DataType.STRING(11) })
		declare cpf: string | null;

		@Column({ allowNull: true, type: DataType.STRING(50) })
		declare gender: string | null;

		@Column({ allowNull: true, type: DataType.DATE })
		declare birth_date: Date | null;

		@Column({ allowNull: false, type: DataType.BOOLEAN })
		declare is_active: boolean;

		@HasMany(() => PetSequelize.PetModel)
		declare pets: PetSequelize.PetModel[];

		@Column({ allowNull: false, type: DataType.DATE })
		declare created_at: Date;

		@Column({ allowNull: true, type: DataType.DATE })
		declare updated_at: Date | null;

		static factory() {
			const chance: Chance.Chance = require('chance')();
			return new SequelizeModelFactory<CustomerModel, CustomerModelProps>(
				CustomerModel,
				() => ({
					id: chance.guid({ version: 4 }),
					name: chance.name({ middle: true }),
					email: chance.email({ domain: 'example.com' }),
					cellphone: '88988887777',
					cpf: chance.cpf().replace(/\D/g, ''),
					gender: chance.gender(),
					birth_date: chance.birthday(),
					is_active: chance.bool(),
					pets: [],
					created_at: chance.date(),
					updated_at: null,
				})
			);
		}
	}

	export class CustomerSequelizeRepository
		implements CustomerRepository.Repository
	{
		constructor(private customerModel: typeof CustomerModel) {}

		sortableFields: string[] = ['name', 'email', 'birth_date'];

		async insert(entity: Customer): Promise<void> {
			await this.customerModel.create(entity.toJSON());
		}

		async findById(id: string | UniqueEntityId): Promise<Customer> {
			const _id = `${id}`;
			const model = await this._get(_id);
			return CustomerModelMapper.toEntity(model);
		}

		async findAll(): Promise<Customer[]> {
			const models = await this.customerModel.findAll();
			return models.map(CustomerModelMapper.toEntity);
		}

		async update(entity: Customer): Promise<void> {
			await this._get(entity.id);
			await this.customerModel.update(entity.toJSON(), {
				where: { id: entity.id },
			});
		}

		async delete(id: string | UniqueEntityId): Promise<void> {
			const _id = `${id}`;
			await this._get(_id);
			await this.customerModel.destroy({ where: { id: _id } });
		}

		private async _get(id: string): Promise<CustomerModel> {
			return this.customerModel.findByPk(id, {
				rejectOnEmpty: new NotFoundError(
					`Entity not found using ID ${id}`
				),
			});
		}

		async search(
			props: CustomerRepository.SearchParams
		): Promise<CustomerRepository.SearchResult> {
			const offset = (props.page - 1) * props.per_page;
			const limit = props.per_page;
			const { rows: models, count } =
				await this.customerModel.findAndCountAll({
					...(props.filter && {
						where: { name: { [Op.like]: `%${props.filter}%` } },
					}),
					...(props.sort && this.sortableFields.includes(props.sort)
						? { order: [[props.sort, props.sort_dir]] }
						: { order: [['name', 'ASC']] }),
					offset,
					limit,
				});
			return new CustomerRepository.SearchResult({
				items: models.map((m) => CustomerModelMapper.toEntity(m)),
				current_page: props.page,
				per_page: props.per_page,
				total: count,
				filter: props.filter,
				sort: props.sort,
				sort_dir: props.sort_dir,
			});
		}
	}

	export class CustomerModelMapper {
		static toEntity(model: CustomerModel): Customer {
			const { id, ...otherData } = model.toJSON();

			try {
				return new Customer(otherData, new UniqueEntityId(id));
			} catch (e) {
				if (e instanceof EntityValidationError) {
					throw new LoadEntityError(e.error);
				}

				throw e;
			}
		}
	}
}

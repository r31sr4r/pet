import {Column, DataType, PrimaryKey, Table, Model} from 'sequelize-typescript';
import { SequelizeModelFactory } from '#seedwork/infra'
import Chance from 'chance'; 

type PetModelProps = {
    id: string;
    name: string;
    type: string;
    breed: string;
    gender: string;
    birth_date: Date;
    is_active: boolean;
    created_at: Date;
}

@Table({ tableName: 'pets', timestamps: false })
export class PetModel extends Model<PetModelProps> {
    @PrimaryKey
    @Column({type: DataType.UUID})
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

    static factory(){
        const chance: Chance.Chance = require('chance')();
        return new SequelizeModelFactory<PetModel, PetModelProps>(PetModel,  () => ({
            id: chance.guid({ version: 4 }),
            name: chance.name(),
            type: chance.animal({ type: 'pet' }),
            breed: chance.word({ syllables: 3 }),
            gender: chance.gender(),
            birth_date: chance.birthday(),
            is_active: chance.bool(),
            created_at: chance.date()
        }));
    }
}
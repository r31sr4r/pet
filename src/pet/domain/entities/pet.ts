
export type PetProperties = {
    name: string,
    type: string,
    breed?: string,    
    birth_date?: Date,
    is_active?: boolean,
    created_at?: Date,    
}

export class Pet{
    constructor(public readonly props: PetProperties){
        this.breed = this.props.breed;
        this.birth_date = this.props.birth_date;
        this.is_active = this.props.is_active;
        this.props.created_at = this.props.created_at ?? new Date();
    }
    
    get name(): string {
        return this.props.name;
    }

    get type(): string {
        return this.props.type;
    }

    get breed(): string {
        return this.props.breed;
    }

    private set breed(value) {
        this.props.breed = value ?? null;
    }

    get birth_date(): Date {
        return this.props.birth_date;
    }

    private set birth_date(value) {
        this.props.birth_date = value ?? null;
    }

    get is_active(): boolean {
        return this.props.is_active;
    }

    private set is_active(value){
        this.props.is_active = value ?? true;
    }

    get created_at(): Date {
        return this.props.created_at;
    }

}
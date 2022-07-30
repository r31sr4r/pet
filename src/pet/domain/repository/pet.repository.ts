import { SearchableRepositoryInterface } from "../../../@seedwork/domain/repository/repository-contracts";
import { Pet } from "../entities/pet";

export default interface PetRepository
	extends SearchableRepositoryInterface<Pet, any, any> {}

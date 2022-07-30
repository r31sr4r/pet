import { SearchableInMemoryRepository } from "../../@seedwork/domain/repository/in-memory.repository";
import { Pet } from "../domain/entities/pet";
import PetRepository from "../domain/repository/pet.repository";


export default class PetInMemoryRepository
	extends SearchableInMemoryRepository<Pet>
	implements PetRepository {}

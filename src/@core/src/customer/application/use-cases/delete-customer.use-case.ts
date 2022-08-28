import { CustomerRepository } from "#customer/domain";
import { default as DefaultUseCase } from "../../../@seedwork/application/use-case";

export namespace DeleteCustomerUseCase {
    export class UseCase implements DefaultUseCase<Input, Output> {
        constructor(
            private customerRepository: CustomerRepository.Repository
        ) {}

        async execute(input: Input): Promise<Output> {
            const entity = await this.customerRepository.findById(input.id);
            await this.customerRepository.delete(entity.id);
        }
    }

    export type Input = {
        id: string;
    };

    export type Output = void;
}

export default DeleteCustomerUseCase;
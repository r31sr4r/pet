import {
  CreateCustomerUseCase,
  DeleteCustomerUseCase,
  GetCustomerUseCase,
  ListCustomersUseCase,
  UpdateCustomerUseCase,
} from 'pet-core/customer/application';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Inject,
  Put,
  HttpCode,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { SearchCustomerDto } from './dto/search-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerPresenter } from './presenter/customer.presenter';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('customers')
@ApiTags('Customers')
@ApiBearerAuth()
@UseGuards(AuthGuard())
export class CustomersController {
  @Inject(CreateCustomerUseCase.UseCase)
  private createUseCase: CreateCustomerUseCase.UseCase;

  @Inject(UpdateCustomerUseCase.UseCase)
  private updateUseCase: UpdateCustomerUseCase.UseCase;

  @Inject(DeleteCustomerUseCase.UseCase)
  private deleteUseCase: DeleteCustomerUseCase.UseCase;

  @Inject(GetCustomerUseCase.UseCase)
  private getUseCase: GetCustomerUseCase.UseCase;

  @Inject(ListCustomersUseCase.UseCase)
  private listUseCase: ListCustomersUseCase.UseCase;

  @Post()
  async create(@Body() createCustomerDto: CreateCustomerDto) {
      const output = await this.createUseCase.execute(createCustomerDto);
      return new CustomerPresenter(output);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
      return this.updateUseCase.execute({
          id,
          ...updateCustomerDto,
      });
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
      return this.deleteUseCase.execute({ id });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
      return this.getUseCase.execute({ id });
  }

  @Get()
  search(@Query() searchParams: SearchCustomerDto) {
      return this.listUseCase.execute(searchParams);
  }
}

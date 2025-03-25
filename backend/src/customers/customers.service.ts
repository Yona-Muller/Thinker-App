import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Customers } from './entities/customer.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/utils/pagination/paginated.query.param.dto';

@Injectable()
export class CustomersService {
  private readonly logger = new Logger(CustomersService.name);
  private readonly customersObject = 'Customers';

  constructor(
    @InjectRepository(Customers)
    private customersRepository: Repository<Customers>
  ) {}

  async findAll(paginationDto: PaginationDto): Promise<any> {
    const { page = 1, limit = 100 } = paginationDto;
    const skip = (page - 1) * limit;


    try {
      const [data, total] = await this.customersRepository.findAndCount({
        skip,
        take: limit,
      });

      return {
        data,
        total,
        page,
        limit,
      };
    } catch (error) {
      this.logger.error(`Error in findAll: ${error.message}`);
      throw error;
    }
  }

  async findOne(id: string): Promise<any> {
    const result = await this.customersRepository.findOne({
      where: { id: id, isActive: true },
    });
    if (!result) {
      throw new NotFoundException('Customer not found');
    }
    return result;
  }

  async findAllCustomersByBusinessId(businessId: string): Promise<any[]> {
    const customers = await this.customersRepository.find({
      where: { businessId: businessId}
    });
  
    return customers;
  }

  async create(createCustomerDto: CreateCustomerDto): Promise<any> {
    try {
      const result = this.customersRepository.create(createCustomerDto);
      const customerDb = await this.customersRepository.save(result);
      return customerDb;
    } catch (error) {
      this.logger.error(`Failed to create customer: ${error.message}`);
      throw error;
    }
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<any> {
    try {
      const customer = await this.findOne(id);

      const updatedCustomer = this.customersRepository.merge(customer, updateCustomerDto);
      const customerDb = await this.customersRepository.save(updatedCustomer);

      return customerDb;
    } catch (error) {
      this.logger.error(`Failed to update customer with id ${id}: ${error.message}`);
      throw error;
    }
  }

  async delete(id: string) {
    try {
      const customer = await this.findOne(id);
      customer.isActive = false;
      await this.customersRepository.save(customer);

      return { success: true, message: 'Customer deleted successfully' };
    } catch (error) {
      this.logger.error(`Failed to delete customer with id ${id}: ${error.message}`);
      throw error;
    }
  }
}

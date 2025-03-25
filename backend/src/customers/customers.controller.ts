import { Controller, Get, Param, Post, Body, ValidationPipe, Delete, Query, Patch, Res } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PaginationDto } from 'src/utils/pagination/paginated.query.param.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { IsPublic } from 'src/utils/decorators/isPublic.decorator';
import { ResponseCustomerDto } from './dto/response-customer.dro';

@ApiTags('customer')
@Controller('customer')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @IsPublic()
  @ApiOperation({ summary: 'Get all customers' })
  @ApiResponse({ status: 200, description: 'List of customers', type: [ResponseCustomerDto] })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getCustomers(@Query() paginationDto: PaginationDto) {
    return this.customersService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single customer by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the customer' })
  @ApiResponse({ status: 200, description: 'Customer found', type: ResponseCustomerDto })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async getOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }

  @Get('business/:businessId')
  @ApiOperation({ summary: 'Get all customers for this business ID' })
  @ApiParam({ name: 'businessId', description: 'The business ID' })
  @ApiResponse({ status: 200, description: 'Customers found', type: ResponseCustomerDto })
  @ApiResponse({ status: 404, description: 'No customers found for this business' })
  async findAllCustomersByBusinessId(@Param('businessId') businessId: string) {
    return this.customersService.findAllCustomersByBusinessId(businessId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiBody({ type: CreateCustomerDto })
  @ApiResponse({ status: 201, description: 'Customer created successfully', type: ResponseCustomerDto })
  @ApiResponse({ status: 400, description: 'Invalid customer data' })
  async create(@Body(ValidationPipe) createCustomer: CreateCustomerDto) {
    return this.customersService.create(createCustomer);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing customer' })
  @ApiParam({ name: 'id', description: 'The ID of the customer to update' })
  @ApiResponse({ status: 200, description: 'Customer updated successfully', type: ResponseCustomerDto })
  @ApiResponse({ status: 404, description: 'Failed to update customer with id 07ea-f6ff-40bb-994b-71b8: error message' })
  @ApiBody({ type: UpdateCustomerDto })
  async update(@Param('id') id: string, @Body() updateCustomer: UpdateCustomerDto) {
    return this.customersService.update(id, updateCustomer);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a customer by ID' })
  @ApiResponse({ status: 200, description: 'Customer deleted successfully' })
  @ApiParam({ name: 'id', description: 'The ID of the customer to delete' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async delete(@Param('id') id: string): Promise<{ success: boolean; message: string }> {
    try {
      await this.customersService.delete(id);
      return { success: true, message: 'Customer deleted successfully' };
    } catch (error) {
      return { success: false, message: `Failed to delete customer: ${error.message}` };
    }
  }
}

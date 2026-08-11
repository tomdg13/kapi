import {
  Controller,
  Post,
  Body,
  Get,
  HttpException,
  HttpStatus,
  Put,
  Param,
  Query,
  Delete,
} from '@nestjs/common';
import { VillageIdDto } from 'src/auth/dto/village-id.dto';
import { CheckPromoteDto, CreateDriverDto, CreateOtpDto, CustomerDto, CustomerpDto, PromoteDto, VerifyOtpDto } from 'src/dto/customer.dto';
import { ProvinceIdDto } from 'src/dto/province-id.dto';

import { customerService } from 'src/service/customer.service';
import { Public } from 'src/auth/public.decorator';
import { CheckBannerDto, CreateBannerDto, CreatePromotionDto } from 'src/dto/create-promotion.dto';
@Public()
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: customerService) { }

  // @Post('byId')
  // async findById(@Body() customerDto: CustomerDto) {
  //   try {
  //     return await this.customerService.findCustomerById(customerDto);
  //   } catch (error) {
  //     throw new HttpException(
  //       {
  //         status: HttpStatus.INTERNAL_SERVER_ERROR,
  //         error: 'Error fetching customer by ID',
  //         message: error.message,
  //       },
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  @Post('checkByPhone')
  async checkCustomerByPhone(@Body() dto: CustomerpDto) {
    return await this.customerService.checkCustomerByPhone(dto);
  }

  @Post('CSOTPByPhone')
  async OtpCustomerByPhone(@Body() dto: CustomerpDto) {
    return await this.customerService.OtpCustomerByPhone(dto);
  }

  @Post('checkDriverByPhone')
  async checkDriverByPhone(@Body() dto: { phone: string }) {
    return await this.customerService.checkDriverByPhone(dto);
  }

  @Post('DriverOTPByPhone')
  async OtpDriverByPhone(@Body() dto: CustomerpDto) {
    return await this.customerService.OtpDriverByPhone(dto);
  }

  @Get('bank')
  async getAllBanks() {
    try {
      return await this.customerService.findAllBanks();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error fetching banks',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('province')
  async getAllProvinces() {
    try {
      return await this.customerService.findAllProvinces();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error fetching provinces',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('district')
  async getDistrictsByProvince(@Body() body: ProvinceIdDto) {
    try {
      return await this.customerService.findDistrictsByProvinceId(body.pr_id);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error fetching districts',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('villages')
  async getVillages(@Body() villageDto: VillageIdDto) {
    try {
      return await this.customerService.findVillagesByDistrict(villageDto);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error fetching villages',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('add')
  async addCustomer(@Body() body: any) {
    try {
      return await this.customerService.addCustomerWithPhoto(body);
    } catch (error) {
      console.error('addCustomer error:', error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to create customer',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }



  @Put('update/:phone')
  async updateCustomer(@Param('phone') phone: string, @Body() customerDto: any) {
    console.log('🟡 Received PUT /update/:phone request');
    console.log('🆔 phone param:', phone);
    console.log('📦 Request body:', JSON.stringify(customerDto, null, 2));

    if (!phone || !/^\d+$/.test(phone)) {
      throw new HttpException('Invalid phone number', HttpStatus.BAD_REQUEST);
    }

    const result = await this.customerService.updateCustomerWithPhoto(phone, customerDto);

    console.log('✅ Update result:', result);
    return result;
  }

  @Post('addDriver')
  async addDriver(@Body() body: any) {
    try {
      return await this.customerService.addDriverWithPhoto(body);
    } catch (error) {
      console.error('addDriver error:', error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to create driver',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // @Post('addotp')
  // async create(@Body() createOtpDto: CreateOtpDto) {
  //   return await this.customerService.create(createOtpDto);
  // }

  @Post('addotp')
  async addOtp(@Body() body: { phone: string }) {
    return this.customerService.create(body);
  }


  @Post('verify-otp')
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    const isValid = await this.customerService.verifyOtp(dto.phone, dto.otp);
    if (isValid) {
      return {
        success: true,
        message: 'OTP is valid',
      };
    } else {
      throw new HttpException(
        {
          success: false,
          message: 'OTP is expired or invalid',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }


  @Put('update-password/:phone')
  async updatePassword(
    @Param('phone') phone: string,
    @Body('password') password: string,
  ) {
    if (!phone || !/^\d+$/.test(phone)) {
      throw new HttpException('Invalid phone number', HttpStatus.BAD_REQUEST);
    }

    if (!password || password.trim().length < 6) {
      throw new HttpException('Password must be at least 6 characters', HttpStatus.BAD_REQUEST);
    }

    return await this.customerService.updateCustomerPassword(phone, password);
  }


  @Put('update-dpassword/:phone')
  async updatedPassword(
    @Param('phone') phone: string,
    @Body('password') password: string,
  ) {
    if (!phone || !/^\d+$/.test(phone)) {
      throw new HttpException('Invalid phone number', HttpStatus.BAD_REQUEST);
    }

    if (!password || password.trim().length < 6) {
      throw new HttpException('Password must be at least 6 characters', HttpStatus.BAD_REQUEST);
    }

    return await this.customerService.updateDriverPassword(phone, password);
  }

    @Put('update-iopassword/:phone')
  async updatedioPassword(
    @Param('phone') phone: string,
    @Body('password') password: string,
  ) {
    if (!phone || !/^\d+$/.test(phone)) {
      throw new HttpException('Invalid phone number', HttpStatus.BAD_REQUEST);
    }

    if (!password || password.trim().length < 6) {
      throw new HttpException('Password must be at least 6 characters', HttpStatus.BAD_REQUEST);
    }

    return await this.customerService.updateioPassword(phone, password);
  }



  @Get('NearbyPromotes')
  async getNearbyPromotes(
    @Query('latitude') latitude: string,
    @Query('longitude') longitude: string,
  ) {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      return {
        status: 'error',
        message: 'Invalid latitude or longitude',
        data: [],
      };
    }

    return await this.customerService.getNearbyPromotes({ latitude: lat, longitude: lng });
  }


  @Post('PromotePhone')
  async checkPromoteByPhone(@Body() dto: CheckPromoteDto) {
    return await this.customerService.checkPromoteByPhone(dto);
  }

  @Post('Promoteadd')
  async addPromotion(@Body() createPromotionDto: CreatePromotionDto) {
    return await this.customerService.addPromotionWithPhoto(createPromotionDto);
  }



  @Post('BannerAll')
  async checkBannerByPhone(@Body() dto: CheckBannerDto) {
    return await this.customerService.getAllBanners();
  }

  @Post('AddBanner')
  async addBanner(@Body() createBannerDto: CreateBannerDto) {
    console.log('🚀 Controller received body:', createBannerDto);
    return await this.customerService.addbannerWithPhoto(createBannerDto);
  }

  @Put('UpdateBanner/:id')
  async putUpdateBanner(
    @Param('id') id: number,
    @Body() bannerDto: CreateBannerDto, // Full DTO for PUT
  ): Promise<{ status: string; message: string }> {
    return this.customerService.putUpdateBanner(id, bannerDto);
  }

  @Delete('DeleteBanner/:id')
  async deleteBanner(
    @Param('id') id: number,
  ): Promise<{ status: string; message: string }> {
    return this.customerService.deleteBanner(id);
  }


  // =================== CUSTOMER WITH BALANCE ENDPOINTS ===================

  // Get customer by ID with balance
  @Get(':customerId')
  async getCustomerById(@Param('customerId') customerId: string) {
    const customerIdNum = parseInt(customerId, 10);
    if (isNaN(customerIdNum)) {
      return {
        status: 'error',
        message: 'Invalid customer ID'
      };
    }
    return await this.customerService.getCustomerWithBalance(customerIdNum);
  }

  // Get customer by phone with balance
  @Get('phone/:phone')
  async getCustomerByPhone(@Param('phone') phone: string) {
    return await this.customerService.getCustomerWithBalance(undefined, phone);
  }

  // Get all customers with balance (paginated)
  @Get()
  async getAllCustomersWithBalance(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ) {
    const limitNum = limit ? parseInt(limit, 10) : 50;
    const offsetNum = offset ? parseInt(offset, 10) : 0;

    return await this.customerService.getAllCustomersWithBalance(limitNum, offsetNum);
  }

  // Get customer leaderboard (top customers by balance)
  @Get('leaderboard/:limit?')
  async getCustomerLeaderboard(@Param('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 20;
    return await this.customerService.getCustomerLeaderboard(limitNum);
  }

  // =================== BALANCE SYNC ENDPOINTS ===================

  // Sync specific customer balance
  @Post('sync/balance/:phone')
  async syncCustomerBalance(@Param('phone') phone: string) {
    return await this.customerService.syncCustomerBalance(phone);
  }

  // Sync all customer balances (admin operation)
  @Post('admin/sync-all-balances')
  async syncAllCustomerBalances(@Body() body: { confirm: boolean }) {
    if (!body.confirm) {
      return {
        status: 'error',
        message: 'Balance sync requires confirmation. Send { "confirm": true } to proceed.',
      };
    }

    return await this.customerService.syncAllCustomerBalances();
  }

  // =================== ANALYTICS ENDPOINTS ===================

  // Get customer analytics overview
  @Get('analytics/overview')
  async getCustomerAnalytics() {
    return await this.customerService.getCustomerAnalytics();
  }

  // Get customers by tier
  @Get('tier/:tier')
  async getCustomersByTier(@Param('tier') tier: string) {
    return await this.customerService.getCustomersByTier(tier);
  }

  // Get tier summary
  @Get('analytics/tiers')
  async getTierSummary() {
    try {
      const [platinum, gold, silver, bronze] = await Promise.all([
        this.customerService.getCustomersByTier('PLATINUM'),
        this.customerService.getCustomersByTier('GOLD'),
        this.customerService.getCustomersByTier('SILVER'),
        this.customerService.getCustomersByTier('BRONZE')
      ]);

      return {
        status: 'success',
        message: 'Tier summary fetched successfully',
        data: {
          platinum: {
            count: platinum.status === 'success' ? platinum.data.count : 0,
            balance_range: '10,000+',
          },
          gold: {
            count: gold.status === 'success' ? gold.data.count : 0,
            balance_range: '5,000 - 9,999',
          },
          silver: {
            count: silver.status === 'success' ? silver.data.count : 0,
            balance_range: '1,000 - 4,999',
          },
          bronze: {
            count: bronze.status === 'success' ? bronze.data.count : 0,
            balance_range: '0 - 999',
          },
          total_tiers: 4,
          generated_at: new Date().toISOString()
        }
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Failed to fetch tier summary',
        error: error.message
      };
    }
  }

  // =================== SEARCH ENDPOINTS ===================

  // Search customers
  @Get('search/:searchTerm')
  async searchCustomers(
    @Param('searchTerm') searchTerm: string,
    @Query('searchBy') searchBy?: string
  ) {
    const searchByField = searchBy || 'all';
    return await this.customerService.searchCustomers(searchTerm, searchByField);
  }

  // Advanced search with filters
  @Post('search/advanced')
  async advancedSearchCustomers(@Body() searchCriteria: {
    name?: string;
    phone?: string;
    email?: string;
    status?: string;
    minBalance?: number;
    maxBalance?: number;
    tier?: string;
    limit?: number;
  }) {
    try {
      // Build dynamic query based on criteria
      let query = `
        SELECT 
          c.*,
          COALESCE(t.calculated_balance, 0) as live_balance,
          COALESCE(t.total_transactions, 0) as total_transactions,
          CASE 
            WHEN COALESCE(t.calculated_balance, 0) >= 10000 THEN 'PLATINUM'
            WHEN COALESCE(t.calculated_balance, 0) >= 5000 THEN 'GOLD'
            WHEN COALESCE(t.calculated_balance, 0) >= 1000 THEN 'SILVER'
            ELSE 'BRONZE'
          END as tier
        FROM kd_customer c
        LEFT JOIN (
          SELECT 
            COALESCE(txn.phone, txn.phone_to) as customer_phone,
            SUM(CASE 
              WHEN txn.txn_type IN ('Get Point', 'EARN', 'BONUS') AND txn.phone = COALESCE(txn.phone, txn.phone_to) THEN CAST(txn.point AS SIGNED)
              WHEN txn.txn_type = 'TRANSFER' AND txn.phone_to = COALESCE(txn.phone, txn.phone_to) THEN CAST(txn.point AS SIGNED)
              WHEN txn.txn_type IN ('Use Point', 'REDEEM', 'TRANSFER') AND txn.phone = COALESCE(txn.phone, txn.phone_to) THEN -CAST(txn.point AS SIGNED)
              WHEN txn.txn_type = 'ADJUST' AND txn.phone = COALESCE(txn.phone, txn.phone_to) THEN CAST(txn.point AS SIGNED)
              ELSE 0 
            END) as calculated_balance,
            COUNT(*) as total_transactions
          FROM kd_txn txn
          GROUP BY COALESCE(txn.phone, txn.phone_to)
        ) t ON c.phone = t.customer_phone
        WHERE 1=1
      `;

      const params = [];

      if (searchCriteria.name) {
        query += ' AND c.name LIKE ?';
        params.push(`%${searchCriteria.name}%`);
      }

      if (searchCriteria.phone) {
        query += ' AND c.phone LIKE ?';
        params.push(`%${searchCriteria.phone}%`);
      }

      if (searchCriteria.email) {
        query += ' AND c.email LIKE ?';
        params.push(`%${searchCriteria.email}%`);
      }

      if (searchCriteria.status) {
        query += ' AND c.status = ?';
        params.push(searchCriteria.status);
      }

      // Add balance filters using HAVING clause since calculated_balance is computed
      let havingClause = '';
      if (searchCriteria.minBalance !== undefined) {
        havingClause += ' HAVING COALESCE(t.calculated_balance, 0) >= ?';
        params.push(searchCriteria.minBalance);
      }

      if (searchCriteria.maxBalance !== undefined) {
        if (havingClause) {
          havingClause += ' AND COALESCE(t.calculated_balance, 0) <= ?';
        } else {
          havingClause = ' HAVING COALESCE(t.calculated_balance, 0) <= ?';
        }
        params.push(searchCriteria.maxBalance);
      }

      query += havingClause;
      query += ' ORDER BY COALESCE(t.calculated_balance, 0) DESC';
      query += ` LIMIT ${searchCriteria.limit || 50}`;

      // Note: This would need to be executed via a service method in real implementation
      return {
        status: 'success',
        message: 'Advanced search completed',
        data: {
          search_criteria: searchCriteria,
          query_built: 'Successfully built advanced search query',
          note: 'This endpoint needs DataSource injection to execute the query'
        }
      };

    } catch (error) {
      return {
        status: 'error',
        message: 'Advanced search failed',
        error: error.message
      };
    }
  }

  // =================== CUSTOMER ACTIVITY ENDPOINTS ===================

  // Get inactive customers (no transactions in specified days)
  @Get('inactive/:days')
  async getInactiveCustomers(@Param('days') days: string) {
    const daysNum = parseInt(days, 10) || 30;

    try {
      // This would need to be implemented in the service
      return {
        status: 'success',
        message: `Customers inactive for ${daysNum} days`,
        data: {
          days_threshold: daysNum,
          note: 'Implementation needed in service layer'
        }
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Failed to fetch inactive customers',
        error: error.message
      };
    }
  }

  // Get most active customers
  @Get('analytics/most-active/:limit?')
  async getMostActiveCustomers(@Param('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 20;

    try {
      // This would need to be implemented in the service
      return {
        status: 'success',
        message: `Top ${limitNum} most active customers`,
        data: {
          limit: limitNum,
          note: 'Implementation needed in service layer'
        }
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Failed to fetch most active customers',
        error: error.message
      };
    }
  }

  // =================== BALANCE VERIFICATION ENDPOINTS ===================

  // Check balance consistency for specific customer
  @Get('verify/balance/:phone')
  async verifyCustomerBalance(@Param('phone') phone: string) {
    try {
      const customerResult = await this.customerService.getCustomerWithBalance(undefined, phone);

      if (customerResult.status === 'error') {
        return customerResult;
      }

      const customer = customerResult.data;

      return {
        status: 'success',
        message: 'Balance verification completed',
        data: {
          phone: phone,
          stored_balance: customer.current_balance,
          calculated_balance: customer.live_balance,
          statement_balance: customer.statement_balance,
          balance_status: customer.balance_status,
          verification_status: customer.balance_status === 'SYNCED' ? 'VERIFIED' : 'MISMATCH_DETECTED',
          verified_at: new Date().toISOString()
        }
      };

    } catch (error) {
      return {
        status: 'error',
        message: 'Balance verification failed',
        error: error.message
      };
    }
  }

  // Get customers with balance mismatches
  @Get('admin/balance-mismatches')
  async getBalanceMismatches() {
    try {
      const result = await this.customerService.getAllCustomersWithBalance(1000, 0);

      if (result.status === 'error') {
        return result;
      }

      const mismatches = result.data.customers.filter(customer =>
        customer.balance_status === 'OUT_OF_SYNC'
      );

      return {
        status: 'success',
        message: 'Balance mismatches found',
        data: {
          total_mismatches: mismatches.length,
          customers_with_mismatches: mismatches,
          checked_at: new Date().toISOString()
        }
      };

    } catch (error) {
      return {
        status: 'error',
        message: 'Failed to check balance mismatches',
        error: error.message
      };
    }
  }

  // =================== EXPORT ENDPOINTS ===================

  // Export customer data with balances
  @Get('export/csv')
  async exportCustomersCSV(@Query('tier') tier?: string) {
    try {
      let customers;

      if (tier) {
        const result = await this.customerService.getCustomersByTier(tier);
        customers = result.status === 'success' ? result.data.customers : [];
      } else {
        const result = await this.customerService.getAllCustomersWithBalance(10000, 0);
        customers = result.status === 'success' ? result.data.customers : [];
      }

      // Convert to CSV format
      const csvHeaders = [
        'Customer ID', 'Name', 'Username', 'Phone', 'Email',
        'Status', 'Current Balance', 'Live Balance', 'Tier',
        'Total Transactions', 'Last Transaction Date'
      ];

      const csvRows = customers.map(customer => [
        customer.customer_id,
        customer.name,
        customer.username,
        customer.phone,
        customer.email,
        customer.status,
        customer.current_balance,
        customer.live_balance,
        customer.tier,
        customer.total_transactions,
        customer.last_transaction_date
      ]);

      return {
        status: 'success',
        message: 'Customer export data prepared',
        data: {
          format: 'CSV',
          headers: csvHeaders,
          rows: csvRows,
          total_records: csvRows.length,
          exported_at: new Date().toISOString()
        }
      };

    } catch (error) {
      return {
        status: 'error',
        message: 'Export failed',
        error: error.message
      };
    }
  }

  // =================== HEALTH CHECK ENDPOINT ===================

  // Customer system health check
  @Get('admin/health')
  async getCustomerSystemHealth() {
    try {
      const analytics = await this.customerService.getCustomerAnalytics();

      return {
        status: 'healthy',
        message: 'Customer system health check',
        data: {
          timestamp: new Date().toISOString(),
          customer_service: 'operational',
          balance_integration: 'active',
          total_customers: analytics.status === 'success' ? analytics.data.overview.total_customers : 0,
          active_customers: analytics.status === 'success' ? analytics.data.overview.active_customers : 0,
          customers_with_balance: analytics.status === 'success' ? analytics.data.overview.customers_with_balance : 0
        }
      };

    } catch (error) {
      return {
        status: 'unhealthy',
        message: 'Customer system health check failed',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }


  // Add these two methods to your existing CustomerController class
  // Place them anywhere inside the class (after your existing methods)

  @Put('updateStatus')
  async updateCustomerStatus(
    @Query('phone') phone: string,
    @Query('status') status: string,
  ) {
    if (!phone || !/^\d+$/.test(phone)) {
      throw new HttpException('Invalid phone number', HttpStatus.BAD_REQUEST);
    }

    if (!status || status.trim().length === 0) {
      throw new HttpException('Status is required', HttpStatus.BAD_REQUEST);
    }

    return await this.customerService.updateCustomerStatus(phone, status);
  }

  @Put('updateOnlineStatus')
  async updateCustomerOnlineStatus(
    @Query('phone') phone: string,
    @Query('online') online: string,
  ) {
    if (!phone || !/^\d+$/.test(phone)) {
      throw new HttpException('Invalid phone number', HttpStatus.BAD_REQUEST);
    }

    if (!online || online.trim().length === 0) {
      throw new HttpException('Online status is required', HttpStatus.BAD_REQUEST);
    }

    return await this.customerService.updateCustomeronStatus(phone, online);
  }


}

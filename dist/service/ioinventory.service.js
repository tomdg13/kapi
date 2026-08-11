"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IoInventoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
let IoInventoryService = class IoInventoryService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createInventory(inventoryDto) {
        console.log('📝 [CREATE INVENTORY] Starting inventory creation...');
        console.log('📝 [CREATE INVENTORY] Input DTO:', JSON.stringify(inventoryDto, null, 2));
        try {
            const { barcode, product_id, product_name, location_id, location, store_id, store_name, user_id, branch_id, company_id, amount, expire_date, currency_primary = 'LAK', batch_number, supplier_id, status = 'active', txntype, price, } = inventoryDto;
            console.log('📝 [CREATE INVENTORY] Destructured values:');
            console.log(`   - product_id: ${product_id}`);
            console.log(`   - product_name: ${product_name}`);
            console.log(`   - location_id: ${location_id} (will default to 1 if null)`);
            console.log(`   - location: ${location}`);
            console.log(`   - amount: ${amount} (will default to 0 if null)`);
            console.log(`   - status: ${status}`);
            console.log(`   - currency_primary: ${currency_primary}`);
            console.log(`   - expire_date: ${expire_date}`);
            console.log(`   - batch_number: ${batch_number}`);
            console.log(`   - supplier_id: ${supplier_id}`);
            console.log(`   - barcode: ${barcode}`);
            console.log(`   - store_id: ${store_id}`);
            console.log(`   - store_name: ${store_name}`);
            console.log(`   - user_id: ${user_id}`);
            console.log(`   - branch_id: ${branch_id}`);
            console.log(`   - company_id: ${company_id}`);
            console.log(`   - txntype: ${txntype}`);
            console.log(`   - price: ${price}`);
            const sql = `
      INSERT INTO io_inventory (
        product_id, product_name, location_id, location, amount,
        expire_date, currency_primary, batch_number, supplier_id,
        status, barcode, store_id, store_name, user_id, branch_id,
        txntype, company_id, price, created_date, last_updated
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
            const values = [
                product_id,
                product_name,
                location_id || 1,
                location,
                amount || 0,
                expire_date,
                currency_primary,
                batch_number,
                supplier_id,
                status,
                barcode,
                store_id,
                store_name,
                user_id,
                branch_id,
                txntype,
                company_id,
                price,
            ];
            const startTime = Date.now();
            const result = await this.dataSource.query(sql, values);
            const endTime = Date.now();
            const response = {
                status: 'success',
                message: 'Inventory record created successfully',
                inventory_id: result.insertId,
            };
            return response;
        }
        catch (error) {
            console.error('📝 [CREATE INVENTORY] ❌ Error occurred during inventory creation');
            console.error('📝 [CREATE INVENTORY] ❌ Error message:', error.message);
            console.error('📝 [CREATE INVENTORY] ❌ Error code:', error.code);
            console.error('📝 [CREATE INVENTORY] ❌ Error stack:', error.stack);
            if (error.code === 'ER_DUP_ENTRY') {
                console.error('📝 [CREATE INVENTORY] ❌ Duplicate entry detected - possible barcode/product conflict');
            }
            if (error.code === 'ER_NO_REFERENCED_ROW_2') {
                console.error('📝 [CREATE INVENTORY] ❌ Foreign key constraint failed - check product_id, location_id, supplier_id, etc.');
            }
            console.error('📝 [CREATE INVENTORY] ❌ Input DTO that caused error:', JSON.stringify(inventoryDto, null, 2));
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to create inventory record',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getInventoryByCompany(companyId) {
        try {
            const sql = `SELECT * FROM io_inventory WHERE company_id = ? ORDER BY last_updated DESC`;
            const result = await this.dataSource.query(sql, [companyId]);
            return {
                status: 'success',
                data: result,
                count: result.length,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to retrieve inventory records by company',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getInventoryBStocklow(companyId) {
        try {
            const sql = `
      SELECT 
          x.product_name,
          x.location,
          x.total_amount,
          p.parameter AS stock_status
      FROM (
          SELECT 
              i.product_name,
              i.location,
              i.company_id,
              SUM(i.amount) AS total_amount
          FROM io_inventory i
          WHERE i.company_id = ?
          GROUP BY i.product_name, i.location, i.company_id
      ) x
      JOIN io_parameter p 
          ON p.company_id = x.company_id
         AND x.total_amount >= p.setup
      WHERE p.setup = (
          SELECT MAX(p2.setup)
          FROM io_parameter p2
          WHERE p2.company_id = x.company_id
            AND x.total_amount >= p2.setup
      )
      ORDER BY x.total_amount ASC;
    `;
            const result = await this.dataSource.query(sql, [companyId]);
            return {
                status: 'success',
                data: result,
                count: result.length,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to retrieve low stock inventory records by company',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getInventoryByExpire(companyId) {
        try {
            const sql = `
        WITH inventory_summary AS (
          SELECT
            product_name,
            location,
            SUM(amount) AS total_amount,
            MIN(expire_date) AS min_expire_date,
            COUNT(CASE WHEN expire_date IS NULL THEN 1 END) > 0 AS has_infinity,
            MIN(CASE WHEN expire_date IS NOT NULL THEN expire_date END) AS min_actual_date
          FROM io_inventory
          WHERE company_id = ?
          GROUP BY product_name, location
        ),
        stock_thresholds AS (
          SELECT
            s.product_name,
            s.location,
            p.parameter
          FROM inventory_summary s
          LEFT JOIN io_parameter p ON p.company_id = ?
            AND s.total_amount >= p.setup
            AND p.setup = (
              SELECT MAX(p2.setup)
              FROM io_parameter p2
              WHERE p2.company_id = ?
              AND s.total_amount >= p2.setup
            )
        )
        SELECT
          s.location,
          s.product_name,
          CASE
            WHEN s.min_expire_date IS NULL THEN '∞'
            ELSE DATE_FORMAT(s.min_expire_date, '%Y-%m')
          END AS expire_date,
          CASE
            WHEN s.min_expire_date IS NULL AND s.min_actual_date IS NOT NULL THEN
              CONCAT(
                FLOOR(TIMESTAMPDIFF(MONTH, CURDATE(), s.min_actual_date) / 12), 'Y',
                LPAD(TIMESTAMPDIFF(MONTH, CURDATE(), s.min_actual_date) % 12, 2, '0'), 'M - ∞'
              )
            WHEN s.min_expire_date IS NULL THEN '∞'
            ELSE CONCAT(
              FLOOR(TIMESTAMPDIFF(MONTH, CURDATE(), s.min_expire_date) / 12), 'Y',
              LPAD(TIMESTAMPDIFF(MONTH, CURDATE(), s.min_expire_date) % 12, 2, '0'), 'M'
            )
          END AS month_expire,
          s.total_amount AS amount,
          COALESCE(st.parameter, 'No Stock') AS stock_status
        FROM inventory_summary s
        LEFT JOIN stock_thresholds st ON s.product_name = st.product_name AND s.location = st.location
        ORDER BY s.location, s.product_name;
      `;
            const result = await this.dataSource.query(sql, [companyId, companyId, companyId]);
            return {
                status: 'success',
                data: result,
                count: result.length,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to retrieve inventory records by expire date with stock status',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.IoInventoryService = IoInventoryService;
exports.IoInventoryService = IoInventoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], IoInventoryService);
//# sourceMappingURL=ioinventory.service.js.map
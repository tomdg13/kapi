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
exports.IoProductService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");
let IoProductService = class IoProductService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async findProductById(dto) {
        try {
            console.log('🔍 [findProductById] Request DTO:', JSON.stringify(dto, null, 2));
            const query = `SELECT * FROM io_products WHERE product_id = ?`;
            const result = await this.dataSource.query(query, [dto.id]);
            console.log(`📊 [findProductById] Query result count: ${result.length}`);
            if (result.length === 0) {
                console.log(`❌ [findProductById] Product not found with ID: ${dto.id}`);
                return {
                    status: 'not_found',
                    message: `Product with ID ${dto.id} not found`,
                    data: [],
                };
            }
            const imageBaseUrl = `${process.env.IMAGE_BASE_URL}/ioproduct/`;
            const productWithImageUrl = result.map((product) => ({
                ...product,
                image_url: product.image ? imageBaseUrl + product.image : null,
            }));
            console.log('✅ [findProductById] Success response prepared');
            return {
                status: 'success',
                message: 'Product fetched successfully',
                data: productWithImageUrl,
            };
        }
        catch (error) {
            console.error('❌ [findProductById] Error:', error);
            return {
                status: 'error',
                message: 'Failed to fetch product info',
                error: error.message,
            };
        }
    }
    async findProductByBarcode(barcode) {
        try {
            console.log(`🔍 [findProductByBarcode] Searching for barcode: ${barcode}`);
            const query = `SELECT * FROM io_products WHERE barcode = ? AND status != 'deleted'`;
            const result = await this.dataSource.query(query, [barcode]);
            console.log(`📊 [findProductByBarcode] Query result count: ${result.length}`);
            if (result.length === 0) {
                console.log(`❌ [findProductByBarcode] No product found with barcode: ${barcode}`);
                return {
                    status: 'not_found',
                    message: `Product with barcode ${barcode} not found`,
                    data: [],
                };
            }
            const imageBaseUrl = `${process.env.IMAGE_BASE_URL}/ioproduct/`;
            const productWithImageUrl = result.map((product) => ({
                ...product,
                image_url: product.image ? imageBaseUrl + product.image : null,
            }));
            console.log(`✅ [findProductByBarcode] Product found: ${productWithImageUrl[0].product_name}`);
            return {
                status: 'success',
                message: 'Product found by barcode',
                data: productWithImageUrl[0],
            };
        }
        catch (error) {
            console.error('❌ [findProductByBarcode] Error:', error);
            return {
                status: 'error',
                message: 'Failed to fetch product by barcode',
                error: error.message,
            };
        }
    }
    async findProductsByStatus(dto) {
        try {
            console.log('🔍 [findProductsByStatus] Request DTO:', JSON.stringify(dto, null, 2));
            let query;
            let params = [];
            if (dto.status?.toLowerCase() === 'admin') {
                if (dto.company_id) {
                    query = `SELECT * FROM io_products WHERE company_id = ?`;
                    params.push(dto.company_id);
                }
                else {
                    query = `SELECT * FROM io_products`;
                }
            }
            else {
                const conditions = [];
                if (dto.status) {
                    conditions.push('status = ?');
                    params.push(dto.status);
                }
                if (dto.company_id) {
                    conditions.push('company_id = ?');
                    params.push(dto.company_id);
                }
                if (conditions.length > 0) {
                    query = `SELECT * FROM io_products WHERE ${conditions.join(' AND ')}`;
                }
                else {
                    query = `SELECT * FROM io_products`;
                }
            }
            console.log('🗄️ [findProductsByStatus] Executing query:', query);
            console.log('📝 [findProductsByStatus] Query params:', params);
            const result = await this.dataSource.query(query, params);
            console.log(`📊 [findProductsByStatus] Query result count: ${result.length}`);
            const imageBaseUrl = `${process.env.IMAGE_BASE_URL}/ioproduct/`;
            const productsWithImageUrls = result.map((product) => ({
                ...product,
                image_url: product.image ? imageBaseUrl + product.image : null,
            }));
            console.log('✅ [findProductsByStatus] Success response prepared');
            return {
                status: 'success',
                message: dto.status?.toLowerCase() === 'admin'
                    ? `All products fetched${dto.company_id ? ` for company ${dto.company_id}` : ''}`
                    : `Products fetched${dto.status ? ` with status ${dto.status}` : ''}${dto.company_id ? ` for company ${dto.company_id}` : ''}`,
                data: productsWithImageUrls,
            };
        }
        catch (error) {
            console.error('❌ [findProductsByStatus] Error:', error);
            return {
                status: 'error',
                message: 'Failed to fetch products',
                error: error.message,
            };
        }
    }
    async addProductWithImage(productDto) {
        try {
            console.log('🆕 [addProductWithImage] =================================');
            console.log('📥 [addProductWithImage] Received productDto:');
            console.log(JSON.stringify(productDto, null, 2));
            console.log('🔍 [addProductWithImage] productDto keys:', Object.keys(productDto));
            console.log('🔍 [addProductWithImage] productDto types:', Object.keys(productDto).map(key => `${key}: ${typeof productDto[key]}`));
            const { company_id, product_name, product_code, description, category, brand, barcode, price, supplier_id, notes, unit, image, status = 'active', } = productDto;
            console.log('📋 [addProductWithImage] Extracted fields:');
            console.log(`  - company_id: ${company_id} (${typeof company_id})`);
            console.log(`  - product_name: ${product_name} (${typeof product_name})`);
            console.log(`  - product_code: ${product_code} (${typeof product_code})`);
            console.log(`  - description: ${description} (${typeof description})`);
            console.log(`  - category: ${category} (${typeof category})`);
            console.log(`  - brand: ${brand} (${typeof brand})`);
            console.log(`  - barcode: ${barcode} (${typeof barcode})`);
            console.log(`  - price: ${price} (${typeof price})`);
            console.log(`  - supplier_id: ${supplier_id} (${typeof supplier_id})`);
            console.log(`  - notes: ${notes} (${typeof notes})`);
            console.log(`  - unit: ${unit} (${typeof unit})`);
            console.log(`  - image: ${image ? 'PROVIDED' : 'NULL'} (${typeof image})`);
            console.log(`  - status: ${status} (${typeof status})`);
            if (barcode && company_id) {
                console.log(`🔍 [addProductWithImage] Checking barcode uniqueness: ${barcode} in company ${company_id}`);
                const existingBarcodeQuery = `
          SELECT product_name, barcode, company_id 
          FROM io_products 
          WHERE barcode = ? AND company_id = ? AND status != 'deleted'
        `;
                const existingProducts = await this.dataSource.query(existingBarcodeQuery, [barcode, company_id]);
                console.log(`📊 [addProductWithImage] Existing products with barcode: ${existingProducts.length}`);
                if (existingProducts && existingProducts.length > 0) {
                    const existingProduct = existingProducts[0];
                    console.log(`❌ [addProductWithImage] CONFLICT: Barcode ${barcode} already exists`);
                    console.log(`❌ [addProductWithImage] Existing product:`, existingProduct);
                    throw new common_1.HttpException({
                        status: 'error',
                        message: `Barcode ${barcode} already exists in this company`,
                        details: `Existing product "${existingProduct.product_name}"`,
                    }, common_1.HttpStatus.CONFLICT);
                }
            }
            console.log('🖼️ [addProductWithImage] Processing image...');
            const imageFileName = await this.saveImage(image);
            console.log(`🖼️ [addProductWithImage] Image saved as: ${imageFileName}`);
            const sql = `
        INSERT INTO io_products (
          company_id, product_name, product_code, description, category, brand,
          barcode, price, supplier_id, notes, unit, image, status, created_date, updated_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;
            const values = [
                company_id,
                product_name,
                product_code,
                description,
                category,
                brand,
                barcode,
                price || 0.00,
                supplier_id,
                notes,
                unit,
                imageFileName,
                status,
            ];
            console.log('🗄️ [addProductWithImage] Executing SQL:');
            console.log(sql);
            console.log('📝 [addProductWithImage] SQL values:', values);
            console.log('📝 [addProductWithImage] SQL value types:', values.map(v => typeof v));
            const result = await this.dataSource.query(sql, values);
            console.log('📊 [addProductWithImage] SQL execution result:', result);
            console.log(`✅ [addProductWithImage] Product created successfully: ${product_name}`);
            console.log('🆕 [addProductWithImage] =================================');
            return {
                status: 'success',
                message: 'Product created successfully',
            };
        }
        catch (error) {
            console.error('❌ [addProductWithImage] Error occurred:');
            console.error('❌ [addProductWithImage] Error message:', error.message);
            console.error('❌ [addProductWithImage] Error stack:', error.stack);
            if (error instanceof common_1.HttpException) {
                console.log('❌ [addProductWithImage] Re-throwing HttpException');
                throw error;
            }
            console.log('❌ [addProductWithImage] Wrapping in generic HttpException');
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to create product',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateProductWithImage(productId, productDto) {
        try {
            console.log('📝 [updateProductWithImage] =================================');
            console.log(`📝 [updateProductWithImage] Updating product ID: ${productId}`);
            console.log('📥 [updateProductWithImage] Received productDto:');
            console.log(JSON.stringify(productDto, null, 2));
            const { company_id, product_name, product_code, description, category, brand, barcode, price, supplier_id, notes, unit, image, status, } = productDto;
            console.log(`🔍 [updateProductWithImage] Finding existing product with ID: ${productId}`);
            const [existingProduct] = await this.dataSource.query(`SELECT image FROM io_products WHERE product_id = ?`, [productId]);
            if (!existingProduct) {
                console.log(`❌ [updateProductWithImage] Product not found with ID: ${productId}`);
                throw new common_1.NotFoundException('Product not found');
            }
            console.log('📊 [updateProductWithImage] Existing product found:', existingProduct);
            console.log('🖼️ [updateProductWithImage] Processing image...');
            const imageFileName = image ? await this.saveImage(image) : existingProduct.image;
            console.log(`🖼️ [updateProductWithImage] Image filename: ${imageFileName}`);
            const updates = [];
            const values = [];
            const addField = (fieldName, value) => {
                if (value !== null && value !== undefined) {
                    updates.push(`${fieldName} = ?`);
                    values.push(value);
                    console.log(`📝 [updateProductWithImage] Adding field: ${fieldName} = ${value} (${typeof value})`);
                }
            };
            addField('company_id', company_id);
            addField('product_name', product_name);
            addField('product_code', product_code);
            addField('description', description);
            addField('category', category);
            addField('brand', brand);
            addField('barcode', barcode);
            addField('price', price);
            addField('supplier_id', supplier_id);
            addField('notes', notes);
            addField('unit', unit);
            addField('image', imageFileName);
            addField('status', status);
            updates.push('updated_date = NOW()');
            if (updates.length === 1) {
                console.log('❌ [updateProductWithImage] No valid fields to update');
                throw new Error('No valid fields to update');
            }
            values.push(productId);
            const sql = `
        UPDATE io_products SET
          ${updates.join(', ')}
        WHERE product_id = ?
      `;
            console.log('🗄️ [updateProductWithImage] Executing SQL:');
            console.log(sql);
            console.log('📝 [updateProductWithImage] SQL values:', values);
            const result = await this.dataSource.query(sql, values);
            console.log('📊 [updateProductWithImage] SQL execution result:', result);
            if (result.affectedRows === 0) {
                console.log('❌ [updateProductWithImage] No rows affected');
                throw new common_1.NotFoundException('Product not found or no changes made');
            }
            console.log(`✅ [updateProductWithImage] Product updated successfully for ID: ${productId}`);
            console.log('📝 [updateProductWithImage] =================================');
            return {
                status: 'success',
                message: 'Product updated successfully',
            };
        }
        catch (error) {
            console.error('❌ [updateProductWithImage] Error:', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to update product',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteProduct(productId) {
        try {
            console.log(`🗑️ [deleteProduct] Deleting product ID: ${productId}`);
            const [existingProduct] = await this.dataSource.query(`SELECT product_id, product_name FROM io_products WHERE product_id = ?`, [productId]);
            if (!existingProduct) {
                console.log(`❌ [deleteProduct] Product not found with ID: ${productId}`);
                throw new common_1.NotFoundException('Product not found');
            }
            console.log(`📊 [deleteProduct] Found product: ${existingProduct.product_name}`);
            const sql = `DELETE FROM io_products WHERE product_id = ?`;
            console.log('🗄️ [deleteProduct] Executing SQL:', sql);
            const result = await this.dataSource.query(sql, [productId]);
            console.log('📊 [deleteProduct] SQL execution result:', result);
            if (result.affectedRows === 0) {
                console.log('❌ [deleteProduct] No rows affected');
                throw new Error('Failed to delete product');
            }
            console.log(`✅ [deleteProduct] Product deleted: ${existingProduct.product_name} (ID: ${productId})`);
            return {
                status: 'success',
                message: 'Product deleted successfully',
            };
        }
        catch (error) {
            console.error('❌ [deleteProduct] Error:', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Failed to delete product',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async saveImage(base64Str) {
        if (!base64Str) {
            console.log('🖼️ [saveImage] No image provided, returning null');
            return null;
        }
        try {
            console.log('🖼️ [saveImage] Starting image save process...');
            console.log(`🖼️ [saveImage] Base64 string length: ${base64Str.length}`);
            console.log(`🖼️ [saveImage] Base64 string preview: ${base64Str.substring(0, 50)}...`);
            const uploadPath = path.resolve(process.cwd(), 'public', 'images', 'ioproduct');
            console.log(`🖼️ [saveImage] Upload path: ${uploadPath}`);
            await fs.mkdir(uploadPath, { recursive: true });
            console.log('🖼️ [saveImage] Upload directory created/verified');
            const { mimeType, data } = this.parseBase64Image(base64Str);
            console.log(`🖼️ [saveImage] Parsed MIME type: ${mimeType}`);
            console.log(`🖼️ [saveImage] Parsed data length: ${data.length}`);
            const ext = this.getFileExtension(mimeType);
            console.log(`🖼️ [saveImage] File extension: ${ext}`);
            const uniqueFileName = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
            console.log(`🖼️ [saveImage] Generated filename: ${uniqueFileName}`);
            const filePath = path.join(uploadPath, uniqueFileName);
            console.log(`🖼️ [saveImage] Full file path: ${filePath}`);
            await fs.writeFile(filePath, data, 'base64');
            console.log('✅ [saveImage] Image saved successfully');
            return uniqueFileName;
        }
        catch (error) {
            console.error('❌ [saveImage] Error saving image:', error);
            throw new Error(`Failed to save image: ${error.message}`);
        }
    }
    parseBase64Image(base64Str) {
        console.log('🔍 [parseBase64Image] Parsing base64 string...');
        const matches = base64Str.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
            console.error('❌ [parseBase64Image] Invalid base64 format');
            console.error(`❌ [parseBase64Image] String: ${base64Str.substring(0, 100)}...`);
            throw new Error('Invalid base64 string format');
        }
        const result = {
            mimeType: matches[1],
            data: matches[2],
        };
        console.log(`✅ [parseBase64Image] Parsed successfully: ${result.mimeType}`);
        return result;
    }
    getFileExtension(mimeType) {
        console.log(`🔍 [getFileExtension] Getting extension for: ${mimeType}`);
        const map = {
            'image/jpeg': 'jpg',
            'image/png': 'png',
            'image/gif': 'gif',
            'image/webp': 'webp',
        };
        const extension = map[mimeType] || 'png';
        console.log(`✅ [getFileExtension] Extension: ${extension}`);
        return extension;
    }
};
exports.IoProductService = IoProductService;
exports.IoProductService = IoProductService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], IoProductService);
//# sourceMappingURL=ioproduct.service.js.map
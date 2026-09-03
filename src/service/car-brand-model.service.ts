import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CarBrandEntity } from '../entity/car-brand.entity';
import { CarModelEntity } from '../entity/car-model.entity';
import { mkdir, writeFile } from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class CarBrandModelService {
  constructor(
    @InjectRepository(CarBrandEntity)
    private brandRepo: Repository<CarBrandEntity>,
    @InjectRepository(CarModelEntity)
    private modelRepo: Repository<CarModelEntity>,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  // ===== Car Brand =====
  async findAllBrands(car_type_id?: number) {
    if (car_type_id) {
      return this.dataSource.query(
        `SELECT DISTINCT b.* FROM car_brand b
         INNER JOIN car_brand_type bt ON bt.brand_id = b.brand_id
         WHERE b.is_active = 1 AND bt.car_type_id = ?
         ORDER BY b.brand_name ASC`,
        [car_type_id],
      );
    }
    const imageBaseUrl = process.env.IMAGE_BASE_URL;
    const rows = await this.dataSource.query(`SELECT * FROM car_brand WHERE is_active = 1 ORDER BY brand_name ASC`);
    return rows.map((r: any) => ({ ...r, image: r.image ? `${imageBaseUrl}/car-brand/${r.image}` : null }));
  }

  async addBrand(body: { brand_name: string; image?: string }) {
    const imageFilename = await this.saveCarTypeImage(body.image ?? null, 'car-brand');
    const imageBaseUrl = process.env.IMAGE_BASE_URL;
    await this.dataSource.query(
      `INSERT INTO car_brand (brand_name, image) VALUES (?, ?)`,
      [body.brand_name, imageFilename ?? null],
    );
    const rows = await this.dataSource.query(
      `SELECT * FROM car_brand WHERE brand_name = ? ORDER BY brand_id DESC LIMIT 1`,
      [body.brand_name],
    );
    const row = rows[0];
    return { ...row, image: row.image ? `${imageBaseUrl}/car-brand/${row.image}` : null };
  }

  async updateBrand(id: number, body: { brand_name?: string; is_active?: number; image?: string }) {
    const imageFilename = await this.saveCarTypeImage(body.image ?? null, 'car-brand');
    const imageBaseUrl = process.env.IMAGE_BASE_URL;
    const updates: string[] = [];
    const params: any[] = [];
    if (body.brand_name !== undefined) { updates.push('brand_name = ?'); params.push(body.brand_name); }
    if (body.is_active !== undefined) { updates.push('is_active = ?'); params.push(body.is_active); }
    if (imageFilename) { updates.push('image = ?'); params.push(imageFilename); }
    if (updates.length > 0) {
      params.push(id);
      await this.dataSource.query(`UPDATE car_brand SET ${updates.join(', ')} WHERE brand_id = ?`, params);
    }
    const rows = await this.dataSource.query(`SELECT * FROM car_brand WHERE brand_id = ?`, [id]);
    const row = rows[0];
    return { ...row, image: row.image ? `${imageBaseUrl}/car-brand/${row.image}` : null };
  }

  async deleteBrand(id: number) {
    return this.brandRepo.update(id, { is_active: 0 });
  }

  // ===== Car Model =====
  async findModelsByBrand(brand_id: number) {
    const imageBaseUrl = process.env.IMAGE_BASE_URL;
    const rows = await this.dataSource.query(
      `SELECT * FROM car_model WHERE brand_id = ? AND is_active = 1 ORDER BY model_name ASC`,
      [brand_id],
    );
    return rows.map((r: any) => ({ ...r, image: r.image ? `${imageBaseUrl}/car-model/${r.image}` : null }));
  }

  async addModel(body: { brand_id: number; car_type_id?: number; model_name: string; image?: string }) {
    const imageFilename = await this.saveCarTypeImage(body.image ?? null, 'car-model');
    const imageBaseUrl = process.env.IMAGE_BASE_URL;
    await this.dataSource.query(
      `INSERT INTO car_model (brand_id, car_type_id, model_name, image) VALUES (?, ?, ?, ?)`,
      [body.brand_id, body.car_type_id ?? null, body.model_name, imageFilename ?? null],
    );
    const rows = await this.dataSource.query(
      `SELECT * FROM car_model WHERE brand_id = ? AND model_name = ? ORDER BY model_id DESC LIMIT 1`,
      [body.brand_id, body.model_name],
    );
    const row = rows[0];
    return { ...row, image: row.image ? `${imageBaseUrl}/car-model/${row.image}` : null };
  }

  async updateModel(
    id: number,
    body: { brand_id?: number; car_type_id?: number; model_name?: string; is_active?: number; image?: string },
  ) {
    const imageFilename = await this.saveCarTypeImage(body.image ?? null, 'car-model');
    const imageBaseUrl = process.env.IMAGE_BASE_URL;
    const updates: string[] = [];
    const params: any[] = [];
    if (body.brand_id !== undefined) { updates.push('brand_id = ?'); params.push(body.brand_id); }
    if (body.car_type_id !== undefined) { updates.push('car_type_id = ?'); params.push(body.car_type_id); }
    if (body.model_name !== undefined) { updates.push('model_name = ?'); params.push(body.model_name); }
    if (body.is_active !== undefined) { updates.push('is_active = ?'); params.push(body.is_active); }
    if (imageFilename) { updates.push('image = ?'); params.push(imageFilename); }
    if (updates.length > 0) {
      params.push(id);
      await this.dataSource.query(`UPDATE car_model SET ${updates.join(', ')} WHERE model_id = ?`, params);
    }
    const rows = await this.dataSource.query(`SELECT * FROM car_model WHERE model_id = ?`, [id]);
    const row = rows[0];
    return { ...row, image: row.image ? `${imageBaseUrl}/car-model/${row.image}` : null };
  }

  async deleteModel(id: number) {
    return this.modelRepo.update(id, { is_active: 0 });
  }

  // ===== Car Type Image Helpers =====
  private async saveCarTypeImage(base64Str: string | null, folder: string = 'car-type'): Promise<string | null> {
    if (!base64Str) return null;
    if (!base64Str.startsWith('data:')) return base64Str; // already a filename

    const matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) throw new Error('Invalid base64 image format');

    const mimeType = matches[1];
    const data = matches[2];
    const extMap: Record<string, string> = {
      'image/jpeg': 'jpg', 'image/png': 'png',
      'image/gif': 'gif', 'image/webp': 'webp',
    };
    const ext = extMap[mimeType] || 'png';
    const uniqueName = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
    const uploadPath = path.resolve(process.cwd(), 'public', 'images', folder);
    await mkdir(uploadPath, { recursive: true });
    await writeFile(path.join(uploadPath, uniqueName), Buffer.from(data, 'base64'));
    return uniqueName;
  }

  // ===== Car Type =====
  async addCarType(body: {
    car_type: string;
    car_type_la: string;
    index_price?: number;
    icon?: string;
    emoji?: string;
    image?: string;
  }) {
    const imageFilename = await this.saveCarTypeImage(body.image ?? null);

    await this.dataSource.query(
      `INSERT INTO kd_cartype (car_type, car_type_la, index_price, icon, emoji, image)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        body.car_type,
        body.car_type_la,
        body.index_price ?? null,
        body.icon ?? null,
        body.emoji ?? null,
        imageFilename ?? null,
      ],
    );
    const rows = await this.dataSource.query(
      `SELECT * FROM kd_cartype ORDER BY car_type_id DESC LIMIT 1`,
    );
    const row = rows[0];
    const imageBaseUrl = process.env.IMAGE_BASE_URL;
    return {
      ...row,
      image: row.image ? `${imageBaseUrl}/car-type/${row.image}` : null,
    };
  }

  async updateCarType(
    id: number,
    body: {
      car_type?: string;
      car_type_la?: string;
      index_price?: number;
      icon?: string;
      emoji?: string;
      image?: string;
    },
  ) {
    const imageFilename = await this.saveCarTypeImage(body.image ?? null);

    await this.dataSource.query(
      `UPDATE kd_cartype
       SET car_type = COALESCE(?, car_type),
           car_type_la = COALESCE(?, car_type_la),
           index_price = COALESCE(?, index_price),
           icon = COALESCE(?, icon),
           emoji = COALESCE(?, emoji),
           image = COALESCE(?, image)
       WHERE car_type_id = ?`,
      [
        body.car_type ?? null,
        body.car_type_la ?? null,
        body.index_price ?? null,
        body.icon ?? null,
        body.emoji ?? null,
        imageFilename ?? null,
        id,
      ],
    );
    const rows = await this.dataSource.query(
      `SELECT * FROM kd_cartype WHERE car_type_id = ?`,
      [id],
    );
    const row = rows[0];
    const imageBaseUrl = process.env.IMAGE_BASE_URL;
    return {
      ...row,
      image: row.image ? `${imageBaseUrl}/car-type/${row.image}` : null,
    };
  }

  async deleteCarType(id: number) {
    return this.dataSource.query(
      `DELETE FROM kd_cartype WHERE car_type_id = ?`,
      [id],
    );
  }
}

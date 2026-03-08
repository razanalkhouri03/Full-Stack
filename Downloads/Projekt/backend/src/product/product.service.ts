import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schema/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductDto } from './dto/get-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<Product>,
  ) {}

  async findAll() {
    return this.findAllProducts();
  }

  async create(dto: CreateProductDto): Promise<GetProductDto[]> {
    const code = this.generateCode(dto.name);

    const assignments = Array.isArray(dto.assignments)
      ? dto.assignments.map((a) => ({
          baureihe: a.baureihe,
          models: Array.isArray(a.models) ? a.models : [],
        }))
      : [];

    const product = new this.productModel({
      code,
      name: dto.name,
      assignments,
      variantCount: dto.variantCount || 1,
    });

    await product.save();
    return this.findAllProducts();
  }

  // Funktion zur Code-Generierung
  private generateCode(name: string): string {
    const words = name.split(' ');

    if (words.length === 1) {
      // ein Wort → ersten 2 Buchstaben groß
      return words[0].substring(0, 2).toUpperCase();
    } else {
      // mehrere Wörter → Initialen der Wörter groß
      return words.map((w) => w[0].toUpperCase()).join('');
    }
  }

  async findAllProducts(): Promise<GetProductDto[]> {
    const products = await this.productModel
      .find()
      .sort({ _id: 1 })
      .lean()
      .exec();

    return products.map((p, index) => ({
      _id: p._id.toString(),
      code: p.code,
      name: p.name,
      // Variante pro Produkt, wenn mehrere Varianten implementiert werden, hier einfach fortlaufend
      variantCount: String(index + 1).padStart(2, '0'),
      // Zuweisungen: Baureihe + Models Array
      assignments: (p.assignments || []).map((a) => ({
        baureihe: a.baureihe,
        models: Array.isArray(a.models) ? a.models : [], // stellt sicher, dass es immer ein Array ist
      })),
    }));
  }
}

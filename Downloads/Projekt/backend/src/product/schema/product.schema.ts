import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: [{ baureihe: String, models: [String] }], default: [] })
  assignments: { baureihe: string; models: string[] }[];

  // Anzahl Varianten, um VariantDisplay zu erzeugen
  @Prop({ default: 0 })
  variantCount: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

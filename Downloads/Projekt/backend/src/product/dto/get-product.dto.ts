import { Types } from 'mongoose';

export class GetProductDto {
  _id: string | Types.ObjectId;
  code: string;
  name: string;
  variantCount: string;
  assignments: { baureihe: string; models: string[] }[];
}

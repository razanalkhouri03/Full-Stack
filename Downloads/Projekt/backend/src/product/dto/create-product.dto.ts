export class CreateProductDto {
  name: string;

  variantCount?: number;

  assignments: { baureihe: string; models: string[] }[];
}

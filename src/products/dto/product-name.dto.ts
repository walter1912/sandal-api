import { Product } from "../schema/product.schema";


export class ProductNameDto {
    name: string;
    code: string;
    detail: string;
    listProduct: Product[];
    star: number;
    bought: number;
    img: string;
    cost: number;
}
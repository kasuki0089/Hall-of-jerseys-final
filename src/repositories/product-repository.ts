import { ProductModel } from "@/models/product/product-model";


export interface ProductRepository{
    findAll(): Promise<ProductModel[]>;
    findById(id: string): Promise<ProductModel>;
    findFirstSeven(): Promise<ProductModel[]>;
}
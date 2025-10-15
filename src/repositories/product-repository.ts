import { ProductModel } from "@/models/product/product-model";


export interface ProductRepository{
    findAll(): Promise<ProductModel[]>;
    findById(id: string): Promise<ProductModel>;
    // Novo método para obter os 5 primeiros produtos
    findFirstSeven(): Promise<ProductModel[]>;
}
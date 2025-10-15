import { ProductModel } from "@/models/product/product-model";
import { ProductRepository } from "./product-repository";
import { resolve } from "path";
import { readFile } from "fs/promises";

const ROOT_DIR = process.cwd();
const JSON_PRODUCTS_FILE_PATH = resolve(ROOT_DIR, "src", "db", "seed", "products.json");

const SIMULATE_WAIT_INS_MS = 0;

export class JsonProductRepository implements ProductRepository {
  private async simulateWait() {
    if (SIMULATE_WAIT_INS_MS <= 0) return;
    await new Promise((resolve) => setTimeout(resolve, SIMULATE_WAIT_INS_MS));
  }

  private async readFromDisk(): Promise<ProductModel[]> {
    const jsonContent = await readFile(JSON_PRODUCTS_FILE_PATH, "utf-8");
    const parsedJson = JSON.parse(jsonContent);

    // ✅ Corrigido: suporta JSON com ou sem a chave "products"
    if (Array.isArray(parsedJson)) {
      return parsedJson as ProductModel[];
    }

    if (parsedJson && Array.isArray(parsedJson.products)) {
      return parsedJson.products as ProductModel[];
    }

    throw new Error("Formato inválido no arquivo products.json");
  }

  async findAll(): Promise<ProductModel[]> {
    await this.simulateWait();
    const products = await this.readFromDisk();
    return products;
  }

  async findById(id: string): Promise<ProductModel> {
    await this.simulateWait();

    const products = await this.findAll();
    const product = products.find((product) => product.id === id);

    if (!product) throw new Error("Produto não encontrado");

    return product;
  }

  // ✅ Retorna os 5 primeiros produtos
  async findFirstSeven(): Promise<ProductModel[]> {
    await this.simulateWait();

    const products = await this.findAll();
    return products.slice(0, 7);
  }
}
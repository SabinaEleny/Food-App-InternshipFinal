import { ProductRepository } from '../repositories/product.repository';
import { slugify } from '../utils/slug';
import { ProductDocument } from '../models/product.model';
import { FilterQuery, Types } from 'mongoose';

export interface IGetAllProductsQuery {
  page?: string;
  limit?: string;
  category?: string;
  sortByPrice?: 'asc' | 'desc';
  restaurantId?: string;
}

export class ProductService {
  private readonly productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  public async findAll(
    queryParams: IGetAllProductsQuery,
  ): Promise<{ products: ProductDocument[]; total: number; page: number; totalPages: number }> {
    const page = queryParams.page ? parseInt(queryParams.page, 10) : 1;
    const limit = queryParams.limit ? parseInt(queryParams.limit, 10) : 10;

    const query: FilterQuery<ProductDocument> = {};

    if (queryParams.restaurantId) {
      query.restaurantId = new Types.ObjectId(queryParams.restaurantId);
    }

    if (queryParams.category) {
      query.category = queryParams.category;
    }

    console.log('Executing find with query:', query);

    const { products, total } = await this.productRepository.findAll(query, page, limit);

    const totalPages = limit > 0 ? Math.ceil(total / limit) : 1;

    return { products, total, page, totalPages };
  }

  public async findAllergens(): Promise<string[]> {
    const allergens = await this.productRepository.findAllergens();
    return allergens.sort();
  }

  public async create(input: any) {
    if (input.discountPrice != null && input.discountPrice > input.price) {
      throw Object.assign(new Error('discountPrice must be less than or equal to price'), {
        status: 400,
      });
    }

    const baseSlug = slugify(input.name);
    const slug = await this.productRepository.ensureUniqueSlug(baseSlug);

    const product = await this.productRepository.create({ ...input, slug });
    return product;
  }

  public async findById(id: string) {
    const product = await this.productRepository.findById(id);
    return product ?? undefined;
  }

  public async update(id: string, input: any) {
    if (input.price != null && input.discountPrice != null && input.discountPrice > input.price) {
      throw Object.assign(new Error('discountPrice must be less than or equal to price'), {
        status: 400,
      });
    }

    if (input.name) {
      const baseSlug = slugify(input.name);
      input.slug = await this.productRepository.ensureUniqueSlug(baseSlug);
    }

    const updated = await this.productRepository.update(id, input);
    if (!updated) throw Object.assign(new Error('Product not found'), { status: 404 });
    return updated;
  }

  public async delete(id: string) {
    const deleted = await this.productRepository.delete(id);
    return deleted ?? undefined;
  }

  public async setAvailability(id: string, isAvailable: boolean) {
    const updated = await this.productRepository.setAvailability(id, isAvailable);
    if (!updated) throw Object.assign(new Error('Product not found'), { status: 404 });
    return updated;
  }
}

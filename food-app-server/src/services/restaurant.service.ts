import { RestaurantRepository } from '../repositories/restaurant.repository';
import { slugify } from '../utils/slug';
import { RestaurantDocument } from '../models/restaurant.model';
import { ProductRepository } from '../repositories/product.repository';
import { ProductDocument } from '../models/product.model';

export interface IGetAllRestaurantsQuery {
  page?: string;
  limit?: string;
  allergen?: string;
  category?: string;
}

export class RestaurantService {
  private readonly restaurantRepository: RestaurantRepository;
  private readonly productRepository: ProductRepository;

  constructor() {
    this.restaurantRepository = new RestaurantRepository();
    this.productRepository = new ProductRepository();
  }

  public async findAll(queryParams: IGetAllRestaurantsQuery) {
    const page = queryParams.page ? parseInt(queryParams.page, 10) : 1;
    const limit = queryParams.limit ? parseInt(queryParams.limit, 10) : 10;
    const allergen = queryParams.allergen || null;
    const category = queryParams.category;

    const { restaurants, total } = await this.restaurantRepository.findAll(
      page,
      limit,
      allergen,
      category,
    );

    const totalPages = limit > 0 ? Math.ceil(total / limit) : 1;

    return { restaurants, total, page, totalPages };
  }

  public async findUniqueCategories(): Promise<string[]> {
    const categories = await this.restaurantRepository.findUniqueCategories();
    return categories.sort();
  }

  public async create(input: any): Promise<RestaurantDocument> {
    const baseSlug = slugify(input.name);
    const slug = await this.restaurantRepository.ensureUniqueSlug(baseSlug);

    const restaurantData = {
      ...input,
      slug,
      status: 'draft',
      images: {
        logoUrl: '',
        coverUrl: '',
      },
      location: {
        type: 'Point',
        coordinates: [0, 0],
      },
      openingHours: {},
    };

    const restaurant = await this.restaurantRepository.create(restaurantData);
    return restaurant;
  }

  public async findById(id: string) {
    const restaurant = await this.restaurantRepository.findById(id);
    return restaurant ?? undefined;
  }

  public async update(id: string, input: any) {
    if (input.name) {
      const baseSlug = slugify(input.name);
      input.slug = await this.restaurantRepository.ensureUniqueSlug(baseSlug);
    }

    const updated = await this.restaurantRepository.update(id, input);
    if (!updated) {
      throw Object.assign(new Error('Restaurant not found'), { status: 404 });
    }
    return updated;
  }

  public async delete(id: string): Promise<RestaurantDocument | undefined> {
    const deleted = await this.restaurantRepository.delete(id);
    return deleted ?? undefined;
  }

  public async findAllAdmin() {
    return await this.restaurantRepository.findAllAdmin();
  }

  public async findProductsByRestaurant(restaurantId: string): Promise<ProductDocument[]> {
    return await this.productRepository.findByRestaurantId(restaurantId);
  }
}

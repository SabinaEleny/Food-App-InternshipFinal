import { RestaurantDocument, RestaurantModel } from '../models/restaurant.model';
import { ProductModel } from '../models/product.model';
import { FilterQuery } from 'mongoose';

export class RestaurantRepository {
  public async findAll(
    page: number,
    limit: number,
    allergen: string | null = null,
    category: string | null = null,
  ) {
    const skip = (page - 1) * limit;

    const query: FilterQuery<RestaurantDocument> = {};

    if (allergen) {
      const restaurantIdsWithAllergenFreeProducts = await ProductModel.distinct('restaurantId', {
        allergens: { $ne: allergen },
      });

      query._id = { $in: restaurantIdsWithAllergenFreeProducts };
    }

    if (category) {
      query.categories = category;
    }

    const restaurants = await RestaurantModel.find(query).skip(skip).limit(limit).lean();
    const total = await RestaurantModel.countDocuments(query);

    return { restaurants, total };
  }

  public async findUniqueCategories(): Promise<string[]> {
    const categories = await RestaurantModel.distinct('categories');
    return categories.filter((category) => category != null);
  }

  public async create(data: Partial<RestaurantDocument>) {
    const doc = await RestaurantModel.create(data);
    return doc.toObject();
  }

  public async findById(id: string) {
    return RestaurantModel.findById(id).lean();
  }

  public async update(id: string, update: Partial<RestaurantDocument>) {
    return RestaurantModel.findByIdAndUpdate(id, update, { new: true }).lean();
  }

  public async delete(id: string): Promise<RestaurantDocument | null> {
    return RestaurantModel.findByIdAndDelete(id);
  }

  public async ensureUniqueSlug(slugBase: string): Promise<string> {
    let slug = slugBase;
    let i = 1;
    while (true) {
      const exists = await RestaurantModel.exists({ slug });
      if (!exists) return slug;
      i += 1;
      slug = `${slugBase}-${i}`;
    }
  }

  public async findAllAdmin(): Promise<RestaurantDocument[]> {
    return RestaurantModel.find().sort({ name: 1 }).exec();
  }
}

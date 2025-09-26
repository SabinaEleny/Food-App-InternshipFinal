import { ProductDocument, ProductModel } from '../models/product.model';
import { FilterQuery } from 'mongoose';

export class ProductRepository {
  public async findAll(
    query: FilterQuery<ProductDocument>,
    page: number,
    limit: number,
  ): Promise<{ products: ProductDocument[]; total: number }> {
    const skip = (page - 1) * limit;
    const products = await ProductModel.find(query).skip(skip).limit(limit);
    const total = await ProductModel.countDocuments(query);
    return { products, total };
  }

  public async findAllergens(): Promise<string[]> {
    const allergens = await ProductModel.distinct('allergens');
    return allergens.filter((allergen) => allergen != null);
  }

  public async create(data: Partial<ProductDocument>) {
    const doc = await ProductModel.create(data);
    return doc.toObject();
  }

  public async findById(id: string) {
    return ProductModel.findById(id).lean();
  }

  public async update(id: string, update: Partial<ProductDocument>) {
    return ProductModel.findByIdAndUpdate(id, update, { new: true }).lean();
  }

  public async delete(id: string) {
    return ProductModel.findByIdAndDelete(id);
  }

  public async setAvailability(id: string, isAvailable: boolean) {
    return ProductModel.findByIdAndUpdate(id, { isAvailable }, { new: true }).lean();
  }

  public async findByRestaurantId(restaurantId: string): Promise<ProductDocument[]> {
    return ProductModel.find({ restaurantId: restaurantId }).exec();
  }

  public async ensureUniqueSlug(slugBase: string): Promise<string> {
    let slug = slugBase;
    let i = 1;
    while (true) {
      const exists = await ProductModel.exists({ slug });
      if (!exists) return slug;
      i += 1;
      slug = `${slugBase}-${i}`;
    }
  }
}

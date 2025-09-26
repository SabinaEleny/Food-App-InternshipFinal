import { Address, Card, User, UserDocument, UserModel } from '../models/user.model';
import { Types } from 'mongoose';

export class UserRepository {
  public async getAll(): Promise<UserDocument[]> {
    return UserModel.find({});
  }

  public async getById(id: string | Types.ObjectId): Promise<UserDocument | null> {
    return UserModel.findById(id);
  }

  public async getByEmail(email: string, includePassword = false): Promise<UserDocument | null> {
    const query = UserModel.findOne({ email: email.toLowerCase() });

    if (includePassword) {
      query.select('+passwordHash');
    }

    return query.exec();
  }

  public async getByPhone(phone: string): Promise<UserDocument | null> {
    return UserModel.findOne({ phone });
  }

  public async create(userData: Partial<User>): Promise<UserDocument> {
    return UserModel.create(userData);
  }

  public async update(
    id: string | Types.ObjectId,
    userData: Partial<User>,
  ): Promise<UserDocument | null> {
    return UserModel.findByIdAndUpdate(id, userData, { new: true });
  }

  public async delete(id: string | Types.ObjectId): Promise<UserDocument | null> {
    return UserModel.findByIdAndDelete(id);
  }

  public async addFavorite(
    userId: string | Types.ObjectId,
    restaurantId: string | Types.ObjectId,
  ): Promise<UserDocument | null> {
    return UserModel.findByIdAndUpdate(
      userId,
      { $addToSet: { favorites: restaurantId } },
      { new: true },
    );
  }

  public async removeFavorite(
    userId: string | Types.ObjectId,
    restaurantId: string | Types.ObjectId,
  ): Promise<UserDocument | null> {
    return UserModel.findByIdAndUpdate(
      userId,
      { $pull: { favorites: restaurantId } },
      { new: true },
    );
  }

  public async addAddress(
    userId: string | Types.ObjectId,
    addressData: Omit<Address, '_id'>,
  ): Promise<UserDocument | null> {
    return UserModel.findByIdAndUpdate(
      userId,
      { $push: { addresses: addressData } },
      { new: true },
    );
  }

  public async updateAddress(
    userId: string | Types.ObjectId,
    addressId: string | Types.ObjectId,
    addressData: Partial<Omit<Address, '_id'>>,
  ): Promise<UserDocument | null> {
    const updateFields: { [key: string]: any } = {};
    for (const key in addressData) {
      updateFields[`addresses.$.${key}`] = (addressData as any)[key];
    }
    return UserModel.findOneAndUpdate(
      { _id: userId, 'addresses._id': addressId },
      { $set: updateFields },
      { new: true },
    );
  }

  public async deleteAddress(
    userId: string | Types.ObjectId,
    addressId: string | Types.ObjectId,
  ): Promise<UserDocument | null> {
    return UserModel.findByIdAndUpdate(
      userId,
      { $pull: { addresses: { _id: addressId } } },
      { new: true },
    );
  }

  public async addCard(
    userId: string | Types.ObjectId,
    cardData: Card,
  ): Promise<UserDocument | null> {
    return UserModel.findByIdAndUpdate(
      userId,
      { $push: { cards: cardData } },
      { new: true, runValidators: true },
    );
  }

  public async updateCard(
    userId: string | Types.ObjectId,
    cardId: string | Types.ObjectId,
    cardData: Partial<Omit<Card, '_id'>>,
  ): Promise<UserDocument | null> {
    const updateFields: { [key: string]: any } = {};
    for (const key in cardData) {
      updateFields[`cards.$.${key}`] = (cardData as any)[key];
    }
    return UserModel.findOneAndUpdate(
      { _id: userId, 'cards._id': cardId },
      { $set: updateFields },
      { new: true, runValidators: true },
    );
  }

  public async deleteCard(
    userId: string | Types.ObjectId,
    last4Digits: string,
  ): Promise<UserDocument | null> {
    return UserModel.findByIdAndUpdate(
      userId,
      { $pull: { cards: { last4Digits: last4Digits } } },
      { new: true },
    );
  }
}

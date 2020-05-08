import { Deserializable } from "../interfaces/deserializable.interface";

export class Product {

  public _id: string;
  public name: string;
  public description?: string;
  public category?: string;
  public tags?: string[];
  public price: {
    sale: number,
    previous?: number
  };
  public ratings?: {
    rating: number,
    ratingCount: number
  };
  public features?: string[];
  public photo?: string;
  public gallery?: string[];
  public badge?: { text: string, color?: string };
  public partnerId: number;
  public partnerName: string;

  constructor(product: any = {}) {
    this._id = product.id;
    this.name = product.name || '';
    this.description = product.description || '';
  }

  // deserialize(input: any) {
  //   Object.assign(this, input);
  //   return this;
  // }


}

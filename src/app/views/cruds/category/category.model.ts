import { Deserializable } from "app/shared/interfaces/deserializable.interface";

export class Category {

  id: string;
  avatarUrl: string;
  name: string;
  description: string;
  isActive: boolean;

  constructor(category: any = {}) {
    this.id = category.id;
    this.name = category.name || '';
    this.description = category.description || '';
    this.avatarUrl = category.avatarUrl || '';
    this.isActive = category.isActive || false;
  }

  // deserialize(input: any) {
  //   Object.assign(this, input);
  //   return this;
  // }
}

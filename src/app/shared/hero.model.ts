import { Deserializable } from "./interfaces/deserializable.interface";

export class Hero implements Deserializable {
  id: string;
  avatarUrl: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  end: string;
  password: string;

  constructor(hero: any = {}) {
    this.id = hero.id;
    this.firstName = hero.firstName || '';
    this.lastName = hero.lastName || '';
    this.email = hero.email || '';
    this.phone = hero.phone || '';
    this.end = hero.end || '';
    this.password = hero.password || '';
    this.avatarUrl = hero.avatarUrl || '';
  }

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}

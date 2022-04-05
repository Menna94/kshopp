import {Entity, hasMany, model, property} from '@loopback/repository';
import {User} from './user.model';

@model()
export class Product extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @property({
    type: 'number',
    required: true,
  })
  price: number;

  @property({
    type: 'string',
  })
  shortDescription?: string;

  @property({
    type: 'string',
    required: true,
  })
  imgURL: string;

  @hasMany(() => User)
  users: User[];

  constructor(data?: Partial<Product>) {
    super(data);
  }
}

export interface ProductRelations {
  // describe navigational properties here
}

export type ProductWithRelations = Product & ProductRelations;

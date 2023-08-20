import {Entity, model, property} from '@loopback/repository';

@model()
export class A extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;


  constructor(data?: Partial<A>) {
    super(data);
  }
}

export interface ARelations {
  // describe navigational properties here
}

export type AWithRelations = A & ARelations;

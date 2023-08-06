import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {Prueba, PruebaRelations} from '../models';
//creado con lb4 repository

export class PruebaRepository extends DefaultCrudRepository<
  Prueba,
  typeof Prueba.prototype.id,
  PruebaRelations
> {
  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource,
  ) {
    super(Prueba, dataSource);
  }
}

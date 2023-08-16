import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {Log, LogRelations, Usuario} from '../models';
import {UsuarioRepository} from './usuario.repository';

export class LogRepository extends DefaultCrudRepository<
  Log,
  typeof Log.prototype.id,
  LogRelations
> {

  public readonly usuario: BelongsToAccessor<Usuario, typeof Log.prototype.id>;

  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource, @repository.getter('UsuarioRepository') protected usuarioRepositoryGetter: Getter<UsuarioRepository>,
  ) {
    super(Log, dataSource);
    this.usuario = this.createBelongsToAccessorFor('usuario', usuarioRepositoryGetter,);
    this.registerInclusionResolver('usuario', this.usuario.inclusionResolver);
  }
}

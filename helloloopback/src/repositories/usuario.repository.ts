import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {Usuario, UsuarioRelations, Log} from '../models';
import {LogRepository} from './log.repository';

export class UsuarioRepository extends DefaultCrudRepository<
  Usuario,
  typeof Usuario.prototype.id,
  UsuarioRelations
> {

  public readonly logs: HasManyRepositoryFactory<Log, typeof Usuario.prototype.id>;

  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource, @repository.getter('LogRepository') protected logRepositoryGetter: Getter<LogRepository>,
  ) {
    super(Usuario, dataSource);
    this.logs = this.createHasManyRepositoryFactoryFor('logs', logRepositoryGetter,);
    this.registerInclusionResolver('logs', this.logs.inclusionResolver);
  }
}

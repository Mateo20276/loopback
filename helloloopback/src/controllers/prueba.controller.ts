import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Prueba} from '../models';
import {PruebaRepository} from '../repositories';
//lb4 controller
export class PruebaController {
  constructor(
    @repository(PruebaRepository)
    public pruebaRepository : PruebaRepository,
  ) {}

  @post('/pruebas')
  @response(200, {
    description: 'Prueba model instance',
    content: {'application/json': {schema: getModelSchemaRef(Prueba)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Prueba, {
            title: 'NewPrueba',
            exclude: ['id'],
          }),
        },
      },
    })
    prueba: Omit<Prueba, 'id'>,
  ): Promise<Prueba> {
    return this.pruebaRepository.create(prueba);
  }

  @get('/pruebas/count')
  @response(200, {
    description: 'Prueba model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Prueba) where?: Where<Prueba>,
  ): Promise<Count> {
    return this.pruebaRepository.count(where);
  }

  @get('/pruebas')
  @response(200, {
    description: 'Array of Prueba model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Prueba, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Prueba) filter?: Filter<Prueba>,
  ): Promise<Prueba[]> {
    return this.pruebaRepository.find(filter);
  }

  @patch('/pruebas')
  @response(200, {
    description: 'Prueba PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Prueba, {partial: true}),
        },
      },
    })
    prueba: Prueba,
    @param.where(Prueba) where?: Where<Prueba>,
  ): Promise<Count> {
    return this.pruebaRepository.updateAll(prueba, where);
  }

  @get('/pruebas/{id}')
  @response(200, {
    description: 'Prueba model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Prueba, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Prueba, {exclude: 'where'}) filter?: FilterExcludingWhere<Prueba>
  ): Promise<Prueba> {
    return this.pruebaRepository.findById(id, filter);
  }

  @patch('/pruebas/{id}')
  @response(204, {
    description: 'Prueba PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Prueba, {partial: true}),
        },
      },
    })
    prueba: Prueba,
  ): Promise<void> {
    await this.pruebaRepository.updateById(id, prueba);
  }

  @put('/pruebas/{id}')
  @response(204, {
    description: 'Prueba PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() prueba: Prueba,
  ): Promise<void> {
    await this.pruebaRepository.replaceById(id, prueba);
  }

  @del('/pruebas/{id}')
  @response(204, {
    description: 'Prueba DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.pruebaRepository.deleteById(id);
  }
}

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
  HttpErrors,
} from '@loopback/rest';
import {Credencial, Usuario,Log, Codigo2Fa, Credencialcambioclave, Notificacionsms} from '../models';
import {LogRepository, UsuarioRepository} from '../repositories';
import { Encryptado } from '../services/encriptado';
import { ServiceKeys as Keys } from '../Keys/Service-keys';
import { Seguridad } from '../services/seguridad';
import { NotificacionServices } from '../services/notificacion';
import { rejects } from 'assert';
import { authenticate } from '@loopback/authentication';
import { inject } from '@loopback/context';
import { UserProfile, SecurityBindings } from '@loopback/security';


export class UsuarioController {
  constructor(
    @repository(UsuarioRepository)
    public usuarioRepository : UsuarioRepository,
    @repository(LogRepository)
    public logrepositorio: LogRepository,
    @inject(SecurityBindings.USER, { optional: true })
    private usuarioAutenticado: UserProfile,

  ) {}

  @post('/usuarios')
  @response(200, {
    description: 'Usuario model instance',
    content: {'application/json': {schema: getModelSchemaRef(Usuario)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {
            title: 'NewUsuario',
            exclude: ['id'],
          }),
        },
      },
    })
    usuario: Omit<Usuario, 'id'>,
  ): Promise<Object> {
    //verifica usuario y encripa password
    let usuariorep= await this.usuarioRepository.findOne({
      where:{
        email: usuario.email,        
      }
    });
    if (usuariorep){return new HttpErrors[401]("Email ya registrado")}
    else{
    let password1 = new Encryptado(Keys.MD5).Encrypt(usuario.password);
    let codigo2fa = new Seguridad(this.usuarioRepository, this.logrepositorio).Crearcodigo2fa(5);
    let datos = new Notificacionsms();
    datos.destinatario = usuario.phone;
    datos.mensaje = `Codigo2FA:${codigo2fa}`;
    let token=  new Seguridad(this.usuarioRepository, this.logrepositorio).creartoken(usuario);
    //let mensaje = new NotificacionServices().EnviarSms(datos);
    
    usuario.c2fa = codigo2fa;
    usuario.c2fastate = false;
    //let password2 = new Encryptado(Keys.MD5).Encrypt(password1);
    usuario.password = password1;

    return {Usuario: this.usuarioRepository.create(usuario),token: token};
  } 
  }

  @get('/usuarios/count')
  @response(200, {
    description: 'Usuario model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Usuario) where?: Where<Usuario>,
  ): Promise<Count> {
    return this.usuarioRepository.count(where);
  }

  @get('/usuarios')
  @response(200, {
    description: 'Array of Usuario model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Usuario, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Usuario) filter?: Filter<Usuario>,
  ): Promise<Usuario[]> {
    return this.usuarioRepository.find(filter);
  }

  @patch('/usuarios')
  @response(200, {
    description: 'Usuario PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {partial: true}),
        },
      },
    })
    usuario: Usuario,
    @param.where(Usuario) where?: Where<Usuario>,
  ): Promise<Count> {
    return this.usuarioRepository.updateAll(usuario, where);
  }

  @get('/usuarios/{id}')
  @response(200, {
    description: 'Usuario model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Usuario, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Usuario, {exclude: 'where'}) filter?: FilterExcludingWhere<Usuario>
  ): Promise<Usuario> {
    return this.usuarioRepository.findById(id, filter);
  }

  @patch('/usuarios/{id}')
  @response(204, {
    description: 'Usuario PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {partial: true}),
        },
      },
    })
    usuario: Usuario,
  ): Promise<void> {
    await this.usuarioRepository.updateById(id, usuario);
  }

  @put('/usuarios/{id}')
  @response(204, {
    description: 'Usuario PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() usuario: Usuario,
  ): Promise<void> {
    await this.usuarioRepository.replaceById(id, usuario);
  }

  @del('/usuarios/{id}')
  @response(204, {
    description: 'Usuario DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.usuarioRepository.deleteById(id);
  }
// Seguridad(identificacion de usuario)

  @post('/identificar_usuario')
  @response(200,{
    description:"Identifidacion de usuarios",
    content:{'application/json':{schema: getModelSchemaRef(Usuario)}}
  })
  async identificarusuario(
    @requestBody(
      {
        content:{
          'application/json':{
            schema:getModelSchemaRef(Credencial)
          }
        }
      }
    )
    credenciales: Credencial
  ):Promise<object>{
    let usuario = await new Seguridad(this.usuarioRepository, this.logrepositorio).identificarusuario(credenciales);
    if (usuario){
      let codigo2fa = new Seguridad(this.usuarioRepository, this.logrepositorio).Crearcodigo2fa(5);
      let log:Log = new Log();
      log.usuarioId = usuario.id!;
      log.codigo2fa = codigo2fa;
      log.estadocodigo2fa = false;
      log.token = "a";
      log.estadotoken = false;
      this.logrepositorio.create(log);
      return usuario;
    }
    return new HttpErrors[401]("Credenciales incorrectas o invalida")
  }

//verificar 2fa de logeo  
  @post('/verificar-2fa')
  @response(200,{
    description:"validar codigo 2fa",
  })
  async verificarcodig2fa(
    @requestBody(
      {
        content:{
          'application/json':{
            schema:getModelSchemaRef(Codigo2Fa)             
          }
        }
      }
    )
    credenciales: Codigo2Fa
  ):Promise<object>{
    let usuario = await new Seguridad(this.usuarioRepository, this.logrepositorio).valiradcodig2fa(credenciales);
    if (usuario){
     let token = new Seguridad(this.usuarioRepository, this.logrepositorio).creartoken(usuario);  
       let log= await this.logrepositorio.findOne({
          where:{
            usuarioId:usuario.id,
            estadocodigo2fa: false 
          }
        });
        log!.estadocodigo2fa = true;
        this.logrepositorio.updateById(log?.id, log!);
        return{ user: usuario,token: token}
  }
    
    return new HttpErrors[401]("Codigo 2fa invalido")
  }

//verificar 2fa en registro usuario  
  @authenticate('token')
  @post('/validar-registro-usuario')
  @response(200,{
    description:"Validacion de registro de usuario ",
  })
    async verificarusuariotoken()
    : Promise<object>{
      let usuario = await this.usuarioRepository.findOne({
        where:{
          email: this.usuarioAutenticado.email,
          username: this.usuarioAutenticado.username,
          c2fastate: false
        }
      
      })
      if(usuario){
        usuario.c2fastate = true; 
        this.usuarioRepository.updateById(usuario.id, usuario);
        return {usuario}
      }
      
      return new HttpErrors[401]("No se pudo verificar el usuario");
  }
  
  
  
  
  
  
  /*
  async verificarcodig2faregistro(
    @requestBody(
      {
        content:{
          'application/json':{
            schema:getModelSchemaRef(Codigo2Fa)             
          }
        }
      }
    )
    credenciales: Codigo2Fa
  ):Promise<object> {
    try{let usuario= await this.usuarioRepository.findById(credenciales.usuarioId);
      if (usuario.c2fa == credenciales.codigo2fa){
        usuario.c2fastate = true;  
        this.usuarioRepository.updateById(credenciales.usuarioId, usuario);      
      }
    return credenciales;}

    catch{return new HttpErrors[401]("Usuario invalido")}

  }*/

//cambio de contrasena con token
  @authenticate('token')
  @post('/cambio-contrasena')
  @response(200,{
    description:"cambio de contrasena ",
  })
  async recuperarcontrasena(
    @requestBody() datos: Credencialcambioclave,
 
  ):Promise<object>{
    try{let usuario= await this.usuarioRepository.findById(datos.usuarioid);

      
        if((usuario.password == datos.claveactual)&&(datos.nuevaclave1 == datos.nuevaclave2)){
          let password = new Encryptado(Keys.MD5).Encrypt(datos.nuevaclave1);
          usuario.password = password;
          this.usuarioRepository.updateById(datos.usuarioid, usuario);            
         return datos;
        }else{return new HttpErrors[401]("Datos incorrectos");}

    }
    catch{return new HttpErrors[401]("Usuario invalido");}
  }






 /*@post("/identificar_usuario",{
  responses:{
    '200':{
      description:"Identifidacion de usuarios"
      
    }
  }
 })
 async identificar(
  @requestBody() credenciales: Credencial
 ): Promise<Usuario| null>{
  let usuario = await this.usuarioRepository.findOne({
    where:{
      email: credenciales.email,
      password: credenciales.Password
    }
  });
  return usuario;
 }
*/

}

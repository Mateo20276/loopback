// Uncomment these imports to begin using these cool features!

import { repository } from "@loopback/repository";
import { UsuarioRepository } from "../repositories";
import { HttpErrors, getModelSchemaRef, post, requestBody, response } from "@loopback/rest";
import { authentication } from "../services/autenticacion";



// import {inject} from '@loopback/core';

class Credencial{
  username:string;
  password:string;
}


export class UsarioValidacionController {
  
  autenticador: authentication;

  constructor(
    @repository(UsuarioRepository)
    public userrepository: UsuarioRepository
  ) {
    this.autenticador = new authentication(this.userrepository);
  }

  @post('/login',{
    responses:{
      '200':{
        description:'logeo de usuarios'
      }
    }
  })
  async login(
    @requestBody() credenciales: Credencial): Promise<object>{
      let user = await this.autenticador.Identify(credenciales.username,credenciales.password); 
      if(user){
        let tokn = await this.autenticador.generartoken(user);
        return{data: user, token: tokn}
      }else{
        throw new HttpErrors[401]("Usuario o contrasena invalidos");
      }
      
  }

}

//npm i @loopback/authentication
//npm i parse-bearer-token
//npm i @loopback/security

import { AuthenticationStrategy } from "@loopback/authentication";
import { HttpErrors, Request } from "@loopback/rest";
import parseBearerToken from "parse-bearer-token";
import { LogRepository, UsuarioRepository } from "../repositories";
import { repository } from "@loopback/repository";
import { Seguridad } from '../services/seguridad';
import { UserProfile } from "@loopback/security";

export class Strategy implements AuthenticationStrategy{
    name: string = 'token';
    constructor( 
        @repository(UsuarioRepository)
        public usuariorepositorio: UsuarioRepository,
        @repository(LogRepository)
        public logrepositorio: LogRepository
){}


    async authenticate(request: Request): Promise<UserProfile | undefined>{
        const token = parseBearerToken(request)
        if (!token) {
            throw new HttpErrors[401]("No existe token en la solicitud.")
        }
        let info = new Seguridad(this.usuariorepositorio, this.logrepositorio).verificartoken(token);
        if (info){


            let perfil: UserProfile = Object.assign({                
                email: info.email,
                username: info.username
            });
            return perfil; 
        }
        else {throw new HttpErrors[401]("Token enviado invalido")}


    }
    
}
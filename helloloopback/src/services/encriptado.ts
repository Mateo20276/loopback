const Crypto = require ("crypto-js");
import{ServiceKeys as keys} from '../Keys/Service-keys';

export class  Encryptado{
    type:string;
    constructor(type:string){
        this.type =type;
    }
    Encrypt(text:string){
        switch (this.type) {
            case keys.MD5:
                return Crypto.MD5(text).toString();
                break;

            case keys.AES:
                return Crypto.AES.Encrypt(text, 'secretKey').toString();
                break;

            case keys.SHA_512:
                return Crypto.MD5(text).toString();
                break;
        
        
            default:
                return "No se puede cifrar"
                break;
        }
    }
}
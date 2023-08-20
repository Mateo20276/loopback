import { Configuracion } from "../Keys/Service-Keys-Sms";
import { Notificacionsms} from "../models";
var fetch = require('node-fetch');

export class NotificacionServices{
    constructor(){}
//$ npm i node-fetch@2.6.5
//npmnpm i @types/node-fetch

    EnviarSms(datos: Notificacionsms){
        let url = `${Configuracion.urlMensaje}?${Configuracion.destino}=${datos.destinatario}&${Configuracion.mensaje}=${datos.mensaje}&${Configuracion.hash}=${Configuracion.hashGenerado} `;
        fetch(url)
            .then((res:any) => {
                console.log(res.text())
            })

    }
}
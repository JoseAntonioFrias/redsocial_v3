import {
    ACEPTAR_AMISTAD,
    DENEGAR_AMISTAD,
    INSERT_MSN,
    LOGOUT,
    SOLICITAR_AMISTAD,
    USER_ID,
    USERS_SUCCES,
    UPDATE_STORE
} from "../reducers/users";

/*
    Importamos las constantes que definen las acciones y se comunican con el Reducer

    Definimos las funciones que van a lanzar estas constantes para que los reducers hagan lo que deban hacer.
*/

// Cerramos sesión y borramos el userId guardado en localStorage, además de setear el store de logged a false
export const logout = () => {
  localStorage.removeItem('userId');
  return ({
    type: LOGOUT
  })
};

export const updateStore = (data) => ({
    type: UPDATE_STORE,
    data
});

export const insertMessage = (mensaje) => {
  if (!localStorage.getItem('mensajes')) {
    let data = [];
    data.push({
      [mensaje.id]: [mensaje.msg]
    });
    localStorage.setItem('mensajes', JSON.stringify(data));
  } else {
    var mensajesAnteriores = JSON.parse(localStorage.getItem('mensajes'));
    let exist = mensajesAnteriores.find(elem => elem[mensaje.id]);
    if (exist) {
      let index = mensajesAnteriores.findIndex(ele => ele[mensaje.id]);
      mensajesAnteriores[index][mensaje.id].push(mensaje.msg);
    } else {
      mensajesAnteriores.push({
        [mensaje.id]:[mensaje.msg]
      });
    }
    localStorage.removeItem('mensajes');
    localStorage.setItem('mensajes', JSON.stringify(mensajesAnteriores));
  }
  return ({
    type: INSERT_MSN,
    mensajes: mensajesAnteriores
  });
}

export const getUsers = () => {
    return async dispatch => {
        let data = false;
        let url = 'https://randomuser.me/api/?results=8&seed=xyz';
        await fetch(url, {
            method: 'GET', // or 'PUT'
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(response => {
            data = response.results;
        });

        dispatch({
            type: USERS_SUCCES, data
        })
    }
};

export const setUserId = (data) => {
    localStorage.removeItem('userId');
    localStorage.setItem('userId', data);
    return ({
        type: USER_ID,
        data
    });
};

//Solicitamos una amistad y la añadimos al localsTORAGE donde se guardan las globales
export const solicitarAmistad = (solicitud) => {
    if (!localStorage.getItem('solicitudes')) {
        let data = [];
        data.push(solicitud);
        localStorage.setItem('solicitudes', JSON.stringify(data));
    } else {
        var solicitudesAnteriores = JSON.parse(localStorage.getItem('solicitudes'));
        solicitudesAnteriores.push(solicitud);
        localStorage.removeItem('solicitudes');
        localStorage.setItem('solicitudes', JSON.stringify(solicitudesAnteriores));
    }
    return ({
        type: SOLICITAR_AMISTAD,
        data: solicitudesAnteriores
    });
};

// Aceptamos la amistad, así que se quita de las solicitudes propias, de las globales y se guarda el amigo
export const aceptarAmistad = (solicitud) => {
    // GUARDAR LAS SOLICITUDES RESTANTES Y BORRAR LA QUE ACABO DE ACEPTAR
    let solicitudesAMi = JSON.parse(localStorage.getItem('solicitudesAMi'));
    let ind = solicitudesAMi.findIndex(elem => elem.a === solicitud.a && elem.de === solicitud.de);
    solicitudesAMi.splice(ind, 1);
    localStorage.removeItem('solicitudesAMi');
    localStorage.setItem('solicitudesAMi', JSON.stringify(solicitudesAMi));
    // GUARDAR NUEVO AMIGO ACEPTADO COMO MI AMIGO
    if (!localStorage.getItem('amigos')) {
        let data = [];
        data.push({
          [solicitud.a]:[solicitud]
        });
        data.push({
          [solicitud.de]:[solicitud]
        });
        localStorage.setItem('amigos', JSON.stringify(data));
    } else {
        var amigosAnteriores = JSON.parse(localStorage.getItem('amigos'));
        let existeA = amigosAnteriores.findIndex(elem => elem[solicitud.a]);
        let existeDe = amigosAnteriores.findIndex(elem => elem[solicitud.de]);
        if (existeA !== -1) {
          amigosAnteriores[existeA][solicitud.a].push(solicitud);
          if (existeDe !== -1) {
            amigosAnteriores[existeDe][solicitud.de].push(solicitud);
          } else {
            amigosAnteriores.push({
              [solicitud.de]:[solicitud]
            });
          }
        } else if (existeDe !== -1) {
          amigosAnteriores[existeDe][solicitud.de].push(solicitud);
          amigosAnteriores.push({
            [solicitud.a]:[solicitud]
          });
        } else {
          amigosAnteriores.push({
            [solicitud.a]:[solicitud]
          });
          amigosAnteriores.push({
            [solicitud.de]:[solicitud]
          });
        }

        localStorage.removeItem('amigos');
        localStorage.setItem('amigos', JSON.stringify(amigosAnteriores));
    }
    let amigos = amigosAnteriores;
    // ElIMINAR LAS SOLICITUDES PENDIENTES GLOBALES
    let solicitudesGlobales = JSON.parse(localStorage.getItem('solicitudes'));
    let index = solicitudesGlobales.findIndex(elem => elem.a === solicitud.a && elem.de === solicitud.de);
    solicitudesGlobales.splice(index, 1);
    localStorage.removeItem('solicitudes');
    localStorage.setItem('solicitudes', JSON.stringify(solicitudesGlobales));
    return ({
        type: ACEPTAR_AMISTAD,
        data: amigos
    });
};

//Si denegamos una amistad, gestionamos las solicitudes pendientes y las globales para eliminarlas
export const denegarAmistad = (data) => {
    // Borrar de mis solicitudes pendientes
    let solicitudesAMiRestantes = JSON.parse(localStorage.getItem('solicitudesAMi'));
    let inde = solicitudesAMiRestantes.findIndex(elem => elem.a === data.a && elem.de === data.de);
    solicitudesAMiRestantes.splice(inde, 1);
    localStorage.removeItem('solicitudesAMi');
    localStorage.setItem('solicitudesAMi', JSON.stringify(solicitudesAMiRestantes));
    // ElIMINAR DE SOLICITUDES PENDIENTES GLOBALES
    let solicitudesGlobalesRestantes = JSON.parse(localStorage.getItem('solicitudes'));
    let indexx = solicitudesGlobalesRestantes.findIndex(elem => elem.a === data.a && elem.de === data.de);
    solicitudesGlobalesRestantes.splice(indexx, 1);
    localStorage.removeItem('solicitudes');
    localStorage.setItem('solicitudes', JSON.stringify(solicitudesGlobalesRestantes));

    return ({
        type: DENEGAR_AMISTAD,
        data: solicitudesGlobalesRestantes
    })
};

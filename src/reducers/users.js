export const USERS_SUCCES = 'users/USERS_SUCCES';
export const USER_ID = 'users/USER_ID';
export const INSERT_MSN = 'users/INSERT_MSN';
export const SOLICITAR_AMISTAD = 'users/SOLICITAR_AMISTAD';
export const ACEPTAR_AMISTAD = 'users/ACEPTAR_AMISTAD';
export const UPDATE_STORE = 'UPDATE_STORE';
export const LOGOUT = 'users/LOGOUT';
export const DENEGAR_AMISTAD = 'users/DENEGAR_AMISTAD';

const initialState = {
  logged: false,
  username: null,
  password: null,
  userId: null,
  users: null,
  errorUsers: false,
  mensajes: [],
  amigos: [],
  solicitudes: [],
  isFetching: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
      // Actualiza cualquier estado del store que le pasemos en el action
    case UPDATE_STORE: {
        return Object.assign({}, state, action.data);
    }

    // Guardamos la información cuando recibimos el GET de users
    case USERS_SUCCES:
      return {
        ...state,
        users: action.data,
        errorUsers: !action.data,
        isFetching: !state.isFetching
      };

    // Guardamos el id del usuario logeado
    case USER_ID:
      return {
        ...state,
        userId: action.data
      };

    // Insertamos un nuevo mensaje y lo guardamos en store
    case INSERT_MSN:
      return {
        ...state,
        mensajes: action.mensajes
      };

    case DENEGAR_AMISTAD:
        return {
            ...state,
            solicitudes: action.data
        };

    case SOLICITAR_AMISTAD:
      return {
        ...state,
        solicitudes: action.data
      };

    case ACEPTAR_AMISTAD:
      return {
        ...state,
        amigos: action.amigos
      };

    case LOGOUT:
      return {
          ...state,
          logged: false
      };

    default:
      return state
  }
};

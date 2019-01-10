import React, {Component, Fragment} from "react";
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getUsers, solicitarAmistad} from '../../actions';

class Detalle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: props.users.users,
      user: false,
      mensajes: 0,
      soisAmigos: false,
      solEnviada: false
    };
  }

  componentDidMount() {
      const { users, userId, location: { state}, logged, history } = this.props;
      const notLogged = !logged || !users || (!userId || !localStorage.getItem('userId'));
      if (notLogged) {
          // Si entramos por url, todavía no hemos cargado todo lo necesario del localStorage, así que nos vamos a la home
          history.push('/');
      } else {
          // vamos a cargar el detalle.
          let mensajes;
          let data;
          let soisAmigos;
          let solEnviada;

          data = this.getUserData(state);
           //'comprobamos quien es
          mensajes = this.getUserMessages(state);
          // comprobamos si tiene mensajes
          soisAmigos = this.comprobarAmistad();
          // compobamos si somos amigos
          solEnviada = this.comprobarSolicitud();
          // compobamos si estamos pendientes de que nos acepte la solicitud
          // guardamos la información en el estado de esta vista actual, no en el store
          this.setState({
              user: data,
              mensajes,
              soisAmigos,
              solEnviada
          })
      };
  }

  //recogemos los mensajes del usuario del perfil visitado
  getUserMessages(id) {
    let mensajes;
    let messages = JSON.parse(localStorage.getItem('mensajes')) || [];
      for (let i = 0; i < messages.length; i++) {
          const me = messages[i][id];
          if (me) {
              mensajes = me;
          }
      }
      this.setState({
          update: false
      });
      return mensajes;
  }
  
  //recogemos los datos del usuario del perfil visitado
  getUserData(id) {
    const { users } = this.props;
    let data = users.users;
    let result = data.filter(user => user.login.uuid === id);

    return result;
  }

  solAmistad() {
    const { users: { users }, userId, location: { state } } = this.props;
    let user = users.filter(user => user.login.uuid === userId);
    let obj = { de: userId, a: state, nombre: user[0].login.username };

    this.props.solicitarAmistad(obj);
    this.setState({ solEnviada: true });
  }

  comprobarAmistad() {
      const { userId, location: { state } } = this.props;
      let amigos = JSON.parse(localStorage.getItem('amigos')) || [];
      let bool = false;

      for (let i = 0; i < amigos.length; i++) {
          const me = amigos[i][userId];
          if (me) {
              for (let i = 0; i < me.length; i++) {
                  if (me[i].de === state || me[i].a === state) {
                      bool = true;
                      return bool;
                  }
              }
          }
      }
    // Si no somos amigos, no nos mostrará los mensajes, si lo somos si.

    return bool;
  }

  //comprueba si ya tiene solicitud enviada
  comprobarSolicitud() {
    const { solicitudes, location: { state }, userId } = this.props;
    // Si no utilizaramos localStorage, habríamos hecho un get inicial que nos lo habría guardardo en el store, 'solicitudes' esta información de entrada, ahora solo funciona si llevamos un rato dentor del mismo usuario y sin refrescar página, por eso tiene más prioridad el localStorage.
    let solicitudesActuales = JSON.parse(localStorage.getItem('solicitudes')) || solicitudes;
    let bool = false;
    for (let i = 0; i < solicitudesActuales.length; i++) {
      if (solicitudesActuales[i].de === userId && solicitudesActuales[i].a === state) {
        bool = true;
      } else if (solicitudesActuales[i].de === state && solicitudesActuales[i].a === userId) {
        bool = true;
      }
    }

    return bool;
  }

  render() {
    const { mensajes } = this.state;
    return (
      <div>
        {this.state.user[0] && (
            <div className="row">
                <div className="col s12 m6 offset-m3">
                    <div className="card">
                        <div className="card-image">
                            <img src={this.state.user[0].picture.large} alt={this.state.user[0].login.username} />
                            <span className="card-title">{this.state.user[0].name.first} {this.state.user[0].name.last}</span>
                        </div>
                        <div className="card-content">
                            <p className="truncate"><b>Ciudad:</b> {this.state.user[0].location.state}</p>
                            <p className="truncate"><b>Email:</b> {this.state.user[0].email}</p>
                        </div>
                        {!this.state.soisAmigos &&(
                            <div className="card-action center-align">
                                {!this.state.solEnviada && this.state.user[0].login.uuid !== this.props.users.userId &&
                                    <button className="waves-effect waves-light btn" onClick={() => this.solAmistad()}>Solicitar Amistad</button>
                                }

                                {this.state.solEnviada && !this.state.soisAmigos && (
                                    <button className="waves-effect waves-light btn" disabled>Pendiente de aceptar</button>
                                )}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        )}

        {this.state.soisAmigos && (
            <ul className="collection with-header">
                <li className="collection-header">
                    <h4>Mensajes</h4>
                </li>
             {mensajes && mensajes.length ? (
                 <Fragment>
                     {mensajes.map((mensaje, index) => (<li className="collection-item" key={index}> <div>{mensaje}</div></li>))}
                </Fragment>
            ): (
                 <li className="collection-item"> {this.state.user[0].name.first} no ha publicado nada todavía.</li>
             )}
            </ul>
        )}
      </div>
    );
  };
}



const mapStateToProps = ({ users }) => ({
  users: users,
  logged: users.logged,
  mensajes: users.mensajes,
  amigos: users.amigos,
  userId: users.userId,
  solicitudes: users.solicitudes
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getUsers,
      solicitarAmistad
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Detalle);

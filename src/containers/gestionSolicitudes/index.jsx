import React, { Component } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getUsers, aceptarAmistad, updateStore, denegarAmistad } from '../../actions';


class GestionSolicitudes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: props.users.users,
      user: false,
      solicitudesActuales: [],
      update: false
    };
  }

  componentDidMount() {
    const { userId, logged, history } = this.props;
      if (!logged) {
          history.push('/');
      } else {
          let result = JSON.parse(localStorage.getItem('solicitudes'));
          result = result && result.filter(solicitud => solicitud.a === userId);
          // Como no usamos ya store si no localStorege esto lo anulamos
          //let result = solicitudes.filter(solicitud => solicitud.sol2 === this.props.users.userId)
          updateStore({ solicitudesActuales: result });
          if (!localStorage.getItem('solicitudesAMi')) {
              localStorage.setItem('solicitudesAMi', JSON.stringify(result));
          } else {
              localStorage.removeItem('solicitudesAMi');
              localStorage.setItem('solicitudesAMi', JSON.stringify(result));
          }
          this.setState({ solicitudesActuales: result });
      }
  }

  componentDidUpdate(prevProps, prevState) {
    const { update } = this.state;
    if (prevState.update !== update && update) {
        let result = JSON.parse(localStorage.getItem('solicitudesAMi'));
        updateStore({ solicitudesActuales: result });
        this.setState({ solicitudesActuales: result, update: false });
    }
  }

  //aceptar solicitud llama al action aceptarAmistad de redux y agrega al store al amigo
  aceptarSolicitud(solicitud) {
    this.props.aceptarAmistad(solicitud);
    this.setState({
        update: true
    });
  }
  
  //rechaza la solicitud de amistad, borra del store la solicitud
  rechazarSolicitud(solicitud) {
    this.props.denegarAmistad(solicitud);
      this.setState({
          update: true
      });
  }

  render() {
    const { solicitudesActuales } = this.state;
    return (
          <ul className="collection with-header">
              <li className="collection-header">
                  <h4>Solicitudes Pendientes:</h4>
              </li>
              {solicitudesActuales && solicitudesActuales.length > 0 ? solicitudesActuales.map((solicitud) => {
                  return (
                      <li className="collection-item" key={solicitud.de}>
                        <div>
                          {solicitud.nombre}
                          <div className="secondary-content">
                            <button
                                disabled={this.state.btnDisabled}
                                className="waves-effect waves-light btn"
                                onClick={() => this.aceptarSolicitud({ de: solicitud.de, a: this.props.users.userId, nombre: solicitud.nombre })}
                            >
                                aceptar
                            </button>
                            <button
                                className="waves-effect waves-light btn red"
                                onClick={() => this.rechazarSolicitud({ de: solicitud.de, a: this.props.users.userId, nombre: solicitud.nombre })}
                            >
                                rechazar
                            </button>
                          </div>
                        </div>
                      </li>

                  )
              }) : (
                  <li className="collection-item"><div>No hay solicitudes</div></li>
              )}
          </ul>
    );
  };
}



const mapStateToProps = ({ users }) => ({
  users: users,
  solicitudes: users.solicitudes,
  amigos: users.amigos,
  userId: users.userId,
  logged: users.logged
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getUsers,
      aceptarAmistad,
      updateStore,
      denegarAmistad
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GestionSolicitudes)


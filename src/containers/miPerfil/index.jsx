import React, {Component, Fragment} from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import { getUsers, insertMessage } from '../../actions';

class MiPerfil extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: props.users.users,
      user: false,
      mensajes: [],
      soisAmigos: false,
      btnAmistadDisabled: false,
      msg: "",
      update: true
    };

  }
  componentDidMount() {
    const { logged } = this.props;
    if (logged) {
        let mensajes;
        let data;
        // si estamos loggeados cargamos los mensajes própios y nuestra información
        mensajes = this.getUserMessages(this.props.users.userId);
        data = this.getUserData(this.props.users.userId);
        this.setState({
            user: data,
            mensajes
        });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { update } = this.state;
      // si se actualiza el estado de update, detectamos que hay algún cambio en el localStorage así que actualizamos render
    if (update && update !== prevState.update) {
      let mensajes = this.getUserMessages(this.props.users.userId);
        this.setState({
            mensajes
        });
    }
  }

  //recoge los mensajes del localStore segun la id del usuario
  getUserMessages(id) {
    let messages = JSON.parse(localStorage.getItem('mensajes')) || [];
    let mensajes;
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

  //recogemos los datos del usuario de la web
  getUserData(id) {
    let data = this.props.users.users
    let result = data.filter(user => user.login.uuid === id)
    return result
  }

  //funcion asincrona que inserta mensaje en el store
  async enviarMensaje() {
    await this.props.insertMessage({ id: this.state.user[0].login.uuid, msg: this.state.msg });
    this.setState({ msg: "", update: true });
  }

  render() {
    return (
      <div>
        <h1>Mi perfil</h1>
          {this.state.user[0] && (
          <div className="row">
              <div className="col s12 m6 offset-m3">
                  <div className="card">
                      <div className="card-image">
                          <img src={this.state.user[0].picture.large} alt={this.state.user[0].login.username}/>
                          <span
                              className="card-title">{this.state.user[0].name.first} {this.state.user[0].name.last}</span>
                      </div>
                      <div className="card-content">
                          <p><b>Ciudad:</b> {this.state.user[0].location.state}</p>
                          <p><b>Email:</b> {this.state.user[0].email}</p>
                      </div>
                    <div className="card-action center-align">
                        <textarea className="materialize-textarea" value={this.state.msg} onChange={(event) => this.setState({ msg: event.target.value })}></textarea>
                        <button className="waves-effect waves-light btn" onClick={() => this.enviarMensaje()}>
                            Publicar mi mensaje
                        </button>
                    </div>
                  </div>

              </div>
          </div>
          )}
          <ul className="collection with-header">
            <li className="collection-header">
                <h4>Mensajes</h4>
            </li>
            {this.state.mensajes ? (
              <Fragment>
                  {this.state.mensajes.map((mensaje, index) => (<li className="collection-item" key={index}> <div>{mensaje}</div></li>))}
              </Fragment>
              ) : (
                <li className="collection-item"> No has publicado nada todavía.</li>
              )
            }
          </ul>
      </div>
    );
  };
}


const mapStateToProps = ({ counter, users, mensajes, amigos, userId }) => ({
  users: users,
  mensajes: mensajes,
  amigos: amigos,
  userId: userId,
  logged: users.logged
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getUsers,
      insertMessage
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MiPerfil)

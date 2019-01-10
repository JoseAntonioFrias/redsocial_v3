import React, { Component, Fragment } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getUsers, setUserId, logout, updateStore } from '../../actions';
import Preloader from '../../components/preloader/';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userValue: '',
      passValue: '',
      errorLogin: false
    };
  }

  loguearse(userName, pass) {
    const { users, updateStore } = this.props;
    //vamos a comprobar que nos podemos loguear, filtrando los usuarios...
    let result = users.users.filter(user => user.login.username === userName && user.login.password === pass);
    // Comprobamos que el userName introducido existe en la base de datos...'

    if (this.state.userValue.length > 0 && this.state.passValue.length > 0) {
      if (!result || !result.length) {
          // 'No hay resultados que coincidan, mostrar error...'
          this.setState({
              errorLogin: true
          });
      } else {
        //  Logueando
        this.props.setUserId(result[0].login.uuid);
          updateStore({
            logged: true
          });
        this.setState({
          errorLogin: false
        });
      }
    } else {
        // No hay resultados que coincidan, mostrar error...
      this.setState({
          errorLogin: true
      });
    }

  };

  render() {
    const { users: { logged }, userId } = this.props;
    const { errorLogin, userValue, passValue } = this.state;
    const data = this.props.users.users;
    return (
      <Fragment>
        {!logged && (
            <Fragment>
                <div className="row">
                    <div className="input-field offset-s3 col s6">
                        <input id="userName" type="text" className="validate" onChange={(event) => this.setState({ userValue: event.target.value })}/>
                        <label className="active" htmlFor="userName">Username</label>
                    </div>
                </div>
                <div className="row">
                    <div className="input-field offset-s3 col s6">
                        <input id="password" type="password" className="validate" onChange={(event) => this.setState({ passValue: event.target.value })}/>
                        <label className="active" htmlFor="password">Password</label>
                    </div>
                </div>
                <div className="row">
                    <div className="input-field offset-s3 col s6">
                        {errorLogin && ( <p className="red-text">Necesitas un usuario y una contraseña válida.</p>)}
                        <button className="btn waves-effect waves-light" type="button" onClick={() => { this.loguearse(userValue, passValue); }}>Entrar</button>
                    </div>
                </div>
            </Fragment>
        )}
        {logged && (
            <div className="row">
                {!data && (
                    <div className="col s4 offset-s4 m4 offset-m4">
                        <div className="center-align">
                            <Preloader />
                        </div>
                    </div>
                )}
              {data && data.map((user) =>
                user.login.uuid !== userId && (
                  <div className="col s12 m4" key={`${user.login.uuid}${user.login.username}`}>
                    <div className="card">
                      <div className="card-image">
                        <img src={user.picture.large} alt={user.login.username} />
                        <Link to={{
                            pathname: `/detalle/${user.name.first}`,
                            state: user.login.uuid
                        }}>
                            <span className="card-title">{user.name.first} {user.name.last}</span>
                        </Link>
                      </div>
                      <div className="card-content">
                        <p className="truncate"><b>Ciudad:</b> {user.location.state}</p>
                        <p className="truncate"><b>Email:</b> {user.email}</p>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
        )}
      </Fragment>
    );
  };
}

const mapStateToProps = ({ users }) => ({
  users: users,
  userId: users.userId
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getUsers,
      setUserId,
      updateStore,
      logout
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);


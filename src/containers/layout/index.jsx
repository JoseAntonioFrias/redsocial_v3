import React, { Component, Fragment } from 'react';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Route } from "react-router-dom";
import { getUsers, logout, updateStore } from "../../actions";
import Home from "../home/";
import GestionSolicitudes from "../gestionSolicitudes/";
import MiPerfil from "../miPerfil/";
import Detalle from "../detalle/";
import Header from "../../components/header";

class Layout extends Component {
    componentDidMount() {
        const { users, getUsers, updateStore, logged, history } = this.props;

        if (!logged) {
            // si no estamos logueados ir a la home
            history.push('/');
        }

        if (localStorage.getItem('userId')) {
            // ya tenemos un usuario activo, lo guardamos y loggeamos
            updateStore({
                userId: localStorage.getItem('userId'),
                logged: true
            });
        }
        if (!users.users) {
            // pedimos usuarios, que no están cargados
            getUsers();
        }
    }

    componentDidUpdate(prevProps) {
        const { logged, history } = this.props;
        if (logged !== prevProps.logged) {
            history.push('/');
        }
    }

    render() {
        const { logged } = this.props;
        return (
            <Fragment>
                <Header logged={logged} action={() => { this.props.logout(); }} />
                <main>
                    <div className="container">
                        <Route exact path="/" component={Home} />
                        <Route exact path="/gestion" component={GestionSolicitudes} />
                        <Route exact path="/MiPerfil" component={MiPerfil} />
                        <Route exact path="/detalle/:pathparams" component={Detalle} />
                    </div>
                </main>
            </Fragment>
        );
    }
}

const mapStateToProps = ({ users }) => ({
    users: users,
    userId: users.userId,
    logged: users.logged
});

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            getUsers,
            updateStore,
            logout
        },
        dispatch
    );

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Layout);

import React, {Fragment} from 'react';
import { Link } from 'react-router-dom';

const Header = ({ logged, action }) => (
    <header>
        <nav>
            <div className="nav-wrapper">
                {logged && (
                    <Fragment>
                        <ul className="left">
                            <li><span/></li>
                            <li><span className="grey-text text-lighten-4 center pointer" onClick={action}>Cerrar sesión</span></li>
                        </ul>
                        <ul className="right">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/gestion">Gestion Solicitudes</Link></li>
                            <li><Link to="/MiPerfil">Mi perfil</Link></li>
                        </ul>
                    </Fragment>
                )}
            </div>
        </nav>
    </header>
);

export default Header;

import React from 'react';
import {NavLink} from 'react-router-dom';

const NavBar = () => {
    return (
        <nav class="navbar" role="navigation" aria-label="main navigation">
        <div id="navbarBasicExample" class="navbar-menu">
            <div class="navbar-start">

            <a class="navbar-item">
                <NavLink to="/roster">
                    Your Roster
                </NavLink>
            </a>

            <a class="navbar-item">
                <NavLink to="/draft">
                    Draft Players
                </NavLink>
            </a>

            </div>
            </div>
        </nav>
    );
}

export default NavBar;
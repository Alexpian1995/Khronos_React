import './Nav.css';
import React from 'react';
import { Link } from 'react-router-dom';

const Nav = ({ to, title, Icon, onClick }) => {
    return (
        <Link to={to} className="nav" onClick={onClick}>
            {Icon && <Icon className="icon" />} {/* Cambia la clase a icon */}
            <h2>{title}</h2> {/* Usa un h2 para el título */}
        </Link>
    );
};

export default Nav;

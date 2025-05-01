import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div className="header">
      <Link to="/">
        <img 
          src="https://cdn.pixabay.com/photo/2013/07/12/19/19/taekwondo-154997_960_720.png" 
          alt="Taekwondo Logo" 
        />
      </Link>
      <h1>Torneos de Taekwondo</h1>
      <p className="lead">Sistema de gestión de torneos y emparejamientos</p>
    </div>
  );
};

export default Header;
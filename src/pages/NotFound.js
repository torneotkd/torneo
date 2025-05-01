import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="text-center py-5">
      <h2>404 - Página no encontrada</h2>
      <p>La página que buscas no existe o ha sido movida.</p>
      <Link to="/" className="btn btn-primary mt-3">
        Volver a la página principal
      </Link>
    </div>
  );
};

export default NotFound;
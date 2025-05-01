import React from 'react';
import { Link } from 'react-router-dom';

const RecentTournaments = ({ tournaments, loading }) => {
  if (loading) {
    return (
      <div className="text-center py-3">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (tournaments.length === 0) {
    return (
      <div className="text-center py-3">
        <p>No hay torneos recientes disponibles.</p>
      </div>
    );
  }

  return (
    <div className="list-group">
      {tournaments.map((tournament) => (
        <Link
          key={tournament.id}
          to={`/tournament/${tournament.id}`}
          className="list-group-item list-group-item-action"
        >
          <div className="d-flex w-100 justify-content-between">
            <h5 className="mb-1">{tournament.name}</h5>
            <small>Código: {tournament.code}</small>
          </div>
          <p className="mb-1">
            {new Date(tournament.date).toLocaleDateString()} - {tournament.location}
          </p>
          <small>Creado por: {tournament.creatorName || 'Anónimo'}</small>
        </Link>
      ))}
    </div>
  );
};

export default RecentTournaments;
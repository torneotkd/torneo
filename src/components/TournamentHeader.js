import React from 'react';

const TournamentHeader = ({ tournament, onBack }) => {
  return (
    <div className="mb-4">
      <button className="btn btn-secondary mb-3" onClick={onBack}>
        <i className="bi bi-arrow-left"></i> Volver
      </button>
      <h2>{tournament.name}</h2>
      <p>
        {new Date(tournament.date).toLocaleDateString()} - {tournament.location}
      </p>
      <div className="tournament-code">CÓDIGO: {tournament.code}</div>
    </div>
  );
};

export default TournamentHeader;
import React, { useState } from 'react';

const SearchTournamentForm = ({ onSearch }) => {
  const [code, setCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.trim()) {
      onSearch(code.trim());
    }
  };

  return (
    <div className="card">
      <div className="card-header">Buscar Torneo</div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="searchCode" className="form-label">
              Código del Torneo
            </label>
            <input
              type="text"
              className="form-control"
              id="searchCode"
              placeholder="Ingrese el código del torneo"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Buscar Torneo
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchTournamentForm;
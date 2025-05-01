import React, { useState } from 'react';

const CreateTournamentForm = ({ onCreate }) => {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    location: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(formData);
  };

  return (
    <div className="card">
      <div className="card-header">Crear Nuevo Torneo</div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Nombre del Torneo
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="Ingrese el nombre del torneo"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="date" className="form-label">
              Fecha del Torneo
            </label>
            <input
              type="date"
              className="form-control"
              id="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="location" className="form-label">
              Ubicación
            </label>
            <input
              type="text"
              className="form-control"
              id="location"
              placeholder="Ingrese la ubicación del torneo"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Crear Torneo
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTournamentForm;
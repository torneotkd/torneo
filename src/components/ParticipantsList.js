import React, { useState } from 'react';

const ParticipantsList = ({ participants, isAdmin, onGenerateBrackets }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredParticipants = participants?.filter(
    (participant) =>
      participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.school.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getBeltOrRankDisplay = (participant) => {
    if (participant.type === 'alumno') {
      return participant.beltLevel;
    } else {
      return `${participant.instructorRank}${
        participant.danLevel ? ` (${participant.danLevel} Dan)` : ''
      }`;
    }
  };

  const getCategoryDisplay = (participant) => {
    if (participant.type === 'alumno') {
      return participant.ageCategory;
    } else {
      return 'Instructor';
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        Participantes Registrados
        <span className="badge bg-primary float-end">
          {participants?.length || 0}
        </span>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar participante..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {participants?.length > 0 ? (
          <>
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Tipo</th>
                    <th>Cinturón/Rango</th>
                    <th>Categoría</th>
                    <th>Escuela</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredParticipants.map((participant) => (
                    <tr key={participant.id}>
                      <td>{participant.name}</td>
                      <td>
                        {participant.type === 'alumno' ? 'Alumno' : 'Maestro'}
                      </td>
                      <td>{getBeltOrRankDisplay(participant)}</td>
                      <td>{getCategoryDisplay(participant)}</td>
                      <td>{participant.school}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {isAdmin && (
              <div className="mt-3">
                <button
                  className="btn btn-success"
                  onClick={onGenerateBrackets}
                >
                  Generar Brackets de Competencia
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="alert alert-info">
            No hay participantes registrados aún.
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticipantsList;
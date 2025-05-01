import React, { useState } from 'react';

const BracketsView = ({ brackets, participants, onSelectWinner, isAdmin }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  if (!brackets) {
    return (
      <div className="card">
        <div className="card-header">Brackets de Competencia</div>
        <div className="card-body">
          <div className="alert alert-info">
            Los brackets aún no han sido generados por el administrador del torneo.
          </div>
        </div>
      </div>
    );
  }

  const categoryKeys = Object.keys(brackets);

  const getParticipantName = (bracket, participantIndex) => {
    if (participantIndex === null) {
      return "Bye (Descansa)";
    }
    
    return bracket.participants[participantIndex]?.name || "No asignado";
  };

  const getParticipantDetails = (bracket, participantIndex) => {
    if (participantIndex === null) {
      return "";
    }
    
    const participant = bracket.participants[participantIndex];
    if (!participant) return "";
    
    return `${participant.school} - ${participant.beltLevel} - ${participant.exactAge} años - ${participant.weight} kg`;
  };

  const handleWinnerSelect = (categoryKey, bracketIndex, roundIndex, matchIndex, winnerId) => {
    if (onSelectWinner && isAdmin) {
      onSelectWinner(categoryKey, bracketIndex, roundIndex, matchIndex, winnerId);
    }
  };

  const renderMatch = (bracket, round, match, roundIndex, matchIndex, categoryKey, bracketIndex) => {
    const comp1 = match.competitor1 !== null ? bracket.participants[match.competitor1] : null;
    const comp2 = match.competitor2 !== null ? bracket.participants[match.competitor2] : null;
    
    const isComp1Winner = match.winner === match.competitor1;
    const isComp2Winner = match.winner === match.competitor2;
    
    return (
      <div className="match" key={match.id}>
        <div 
          className={`competitor ${isComp1Winner ? 'bg-success text-white' : ''}`}
          onClick={() => isAdmin && handleWinnerSelect(categoryKey, bracketIndex, roundIndex, matchIndex, match.competitor1)}
          style={isAdmin ? {cursor: 'pointer'} : {}}
        >
          {match.competitor1 !== null ? (
            <>
              <div>{getParticipantName(bracket, match.competitor1)}</div>
              <div className="competitor-details">
                {getParticipantDetails(bracket, match.competitor1)}
              </div>
            </>
          ) : (
            <div className="text-muted">Bye (Descansa)</div>
          )}
        </div>
        <div 
          className={`competitor ${isComp2Winner ? 'bg-success text-white' : ''}`}
          onClick={() => isAdmin && handleWinnerSelect(categoryKey, bracketIndex, roundIndex, matchIndex, match.competitor2)}
          style={isAdmin ? {cursor: 'pointer'} : {}}
        >
          {match.competitor2 !== null ? (
            <>
              <div>{getParticipantName(bracket, match.competitor2)}</div>
              <div className="competitor-details">
                {getParticipantDetails(bracket, match.competitor2)}
              </div>
            </>
          ) : (
            <div className="text-muted">Bye (Descansa)</div>
          )}
        </div>
      </div>
    );
  };

  const renderBracket = (bracket, categoryKey, bracketIndex) => {
    return (
      <div key={bracket.name} className="mb-5">
        <h4>{bracket.name}</h4>
        {isAdmin && (
          <div className="alert alert-info">
            Haz clic en un competidor para seleccionarlo como ganador y que avance a la siguiente ronda.
          </div>
        )}
        <div className="bracket">
          {bracket.rounds.map((round, roundIndex) => (
            <div className="round" key={`round-${roundIndex}`}>
              <h5 className="text-center mb-3">{round.name}</h5>
              {round.matches.map((match, matchIndex) => 
                renderMatch(bracket, round, match, roundIndex, matchIndex, categoryKey, bracketIndex)
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="card">
      <div className="card-header">Brackets de Competencia</div>
      <div className="card-body">
        <div className="mb-3">
          <label htmlFor="categoryFilter" className="form-label">
            Filtrar por Categoría
          </label>
          <select
            className="form-select"
            id="categoryFilter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">Todas las categorías</option>
            {categoryKeys.map((key) => (
              <option key={key} value={key}>
                {brackets[key].name}
              </option>
            ))}
          </select>
        </div>

        <div className="brackets-container">
          {selectedCategory === 'all'
            ? categoryKeys.map((key) => (
                <div key={key}>
                  <h3>{brackets[key].name}</h3>
                  {brackets[key].brackets.map((bracket, index) => 
                    renderBracket(bracket, key, index)
                  )}
                </div>
              ))
            : brackets[selectedCategory].brackets.map((bracket, index) =>
                renderBracket(bracket, selectedCategory, index)
              )}
        </div>
      </div>
    </div>
  );
};

export default BracketsView;
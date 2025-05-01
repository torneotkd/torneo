import React from 'react';

const TournamentTabs = ({ activeTab, onChangeTab }) => {
  return (
    <ul className="nav nav-tabs mb-4">
      <li className="nav-item">
        <button
          className={`nav-link ${activeTab === 'registration' ? 'active' : ''}`}
          onClick={() => onChangeTab('registration')}
        >
          Registro
        </button>
      </li>
      <li className="nav-item">
        <button
          className={`nav-link ${activeTab === 'participants' ? 'active' : ''}`}
          onClick={() => onChangeTab('participants')}
        >
          Participantes
        </button>
      </li>
      <li className="nav-item">
        <button
          className={`nav-link ${activeTab === 'brackets' ? 'active' : ''}`}
          onClick={() => onChangeTab('brackets')}
        >
          Brackets
        </button>
      </li>
    </ul>
  );
};

export default TournamentTabs;
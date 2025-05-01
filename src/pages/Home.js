import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, orderBy, limit, getDocs, addDoc } from 'firebase/firestore';
import RecentTournaments from '../components/RecentTournaments';
import SearchTournamentForm from '../components/SearchTournamentForm';
import CreateTournamentForm from '../components/CreateTournamentForm';

const Home = ({ db }) => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadRecentTournaments();
  }, []);

  const loadRecentTournaments = async () => {
    try {
      setLoading(true);
      
      const tournamentsQuery = query(
        collection(db, "tournaments"),
        orderBy("createdAt", "desc"),
        limit(10)
      );
      
      const tournamentsSnapshot = await getDocs(tournamentsQuery);
      
      const tournamentsList = [];
      tournamentsSnapshot.forEach((doc) => {
        tournamentsList.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      setTournaments(tournamentsList);
      setLoading(false);
    } catch (error) {
      console.error("Error loading tournaments:", error);
      setLoading(false);
      alert("Error al cargar torneos: " + error.message);
    }
  };

  const handleSearch = async (code) => {
    try {
      const tournamentsRef = collection(db, "tournaments");
      const q = query(tournamentsRef, where("code", "==", code.toUpperCase()));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        alert(`No se encontró ningún torneo con el código ${code}.`);
        return;
      }
      
      const tournamentDoc = querySnapshot.docs[0];
      navigate(`/tournament/${tournamentDoc.id}`);
    } catch (error) {
      console.error("Error searching tournament:", error);
      alert("Error al buscar torneo: " + error.message);
    }
  };

  const handleCreate = async (tournamentData) => {
    try {
      // Generar código único para el torneo
      const code = generateTournamentCode();
      
      const newTournament = {
        ...tournamentData,
        code,
        createdAt: new Date().toISOString(),
        creatorId: "user123", // Idealmente, usar el ID del usuario autenticado
        creatorName: "Usuario", // Idealmente, usar el nombre del usuario autenticado
        participants: [],
        brackets: null
      };
      
      const docRef = await addDoc(collection(db, "tournaments"), newTournament);      
      alert(`Torneo creado con éxito. Código: ${code}`);
      navigate(`/tournament/${docRef.id}`);
    } catch (error) {
      console.error("Error creating tournament:", error);
      alert("Error al crear torneo: " + error.message);
    }
  };

  // Función para generar código aleatorio
  const generateTournamentCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  };

  return (
    <div>
      <div className="row">
        <div className="col-md-6">
          <SearchTournamentForm onSearch={handleSearch} />
        </div>
        <div className="col-md-6">
          <CreateTournamentForm onCreate={handleCreate} />
        </div>
      </div>
      
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">Torneos Recientes</div>
            <div className="card-body">
              <RecentTournaments 
                tournaments={tournaments} 
                loading={loading} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
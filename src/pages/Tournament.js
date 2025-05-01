import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import TournamentHeader from '../components/TournamentHeader';
import TournamentTabs from '../components/TournamentTabs';
import RegistrationForm from '../components/RegistrationForm';
import ParticipantsList from '../components/ParticipantsList';
import BracketsView from '../components/BracketsView';

const Tournament = ({ db }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('registration');

  useEffect(() => {
    loadTournament();
  }, [id]);

  const loadTournament = async () => {
    try {
      setLoading(true);
      
      const tournamentRef = doc(db, "tournaments", id);
      const tournamentDoc = await getDoc(tournamentRef);
      
      if (!tournamentDoc.exists()) {
        alert("El torneo no existe o ha sido eliminado.");
        navigate('/');
        return;
      }
      
      const tournamentData = {
        id: tournamentDoc.id,
        ...tournamentDoc.data()
      };
      
      setTournament(tournamentData);
      
      // Determinar si el usuario actual es administrador
      // Esto debería verificarse con la autenticación real
      setIsAdmin(tournamentData.creatorId === "user123");
      
      setLoading(false);
    } catch (error) {
      console.error("Error loading tournament:", error);
      setLoading(false);
      alert("Error al cargar torneo: " + error.message);
    }
  };

  const handleRegister = async (participantData) => {
    try {
      if (!tournament) {
        alert("No hay un torneo seleccionado.");
        return;
      }
      
      // Generar ID único para el participante
      participantData.id = Date.now().toString();
      participantData.createdAt = new Date().toISOString();
      
      const updatedParticipants = [...tournament.participants, participantData];
      
      // Actualizar en Firebase
      const tournamentRef = doc(db, "tournaments", tournament.id);
      await updateDoc(tournamentRef, {
        participants: updatedParticipants
      });
      
      // Actualizar el estado local
      setTournament({
        ...tournament,
        participants: updatedParticipants
      });
      
      alert("¡Registro exitoso en el torneo!");
      setActiveTab('participants');
    } catch (error) {
      console.error("Error registering participant:", error);
      alert("Error al registrar participante: " + error.message);
    }
  };

  const handleGenerateBrackets = async () => {
    try {
      if (!tournament || tournament.participants.length < 2) {
        alert("Se necesitan al menos 2 participantes para generar brackets.");
        return;
      }
      
      // Generamos los brackets
      const brackets = generateBrackets(tournament.participants);
      
      // Actualizar en Firebase
      const tournamentRef = doc(db, "tournaments", tournament.id);
      await updateDoc(tournamentRef, {
        brackets: brackets
      });
      
      // Actualizar el estado local
      setTournament({
        ...tournament,
        brackets: brackets
      });
      
      alert("Brackets generados exitosamente.");
      setActiveTab('brackets');
    } catch (error) {
      console.error("Error generating brackets:", error);
      alert("Error al generar brackets: " + error.message);
    }
  };

  // Función para generar brackets basados en edad y nivel de cinturón
  const generateBrackets = (participants) => {
    // Filtrar solo alumnos (no instructores)
    const students = participants.filter(p => p.type === 'alumno');
    
    if (students.length === 0) {
      return null;
    }
    
    // Agrupar por categoría de edad y género
    const categories = {};
    
    students.forEach(student => {
      const key = `${student.ageCategory}_${student.gender}`;
      if (!categories[key]) {
        categories[key] = {
          name: `${getAgeCategoryName(student.ageCategory)} ${student.gender === 'masculino' ? 'Masculino' : 'Femenino'}`,
          participants: []
        };
      }
      categories[key].participants.push(student);
    });
    
    // Para cada categoría, crear brackets
    const bracketsByCategory = {};
    
    Object.keys(categories).forEach(categoryKey => {
      const category = categories[categoryKey];
      
      // Si hay pocos participantes, crear un solo bracket
      if (category.participants.length <= 8) {
        const bracketParticipants = optimizeFirstRoundPairings(category.participants);
        bracketsByCategory[categoryKey] = {
          name: category.name,
          brackets: [{
            name: category.name,
            participants: bracketParticipants,
            rounds: createRounds(bracketParticipants.length)
          }]
        };
      } else {
        // Agrupar por nivel de cinturón y peso similar
        const groupsByLevel = groupByBeltAndWeight(category.participants);
        const brackets = [];
        
        // Crear brackets para cada grupo
        groupsByLevel.forEach((group, index) => {
          if (group.length > 1) { // Solo crear bracket si hay al menos 2 participantes
            const bracketParticipants = optimizeFirstRoundPairings(group);
            brackets.push({
              name: `${category.name} - Grupo ${index + 1}`,
              participants: bracketParticipants,
              rounds: createRounds(bracketParticipants.length)
            });
          }
        });
        
        bracketsByCategory[categoryKey] = {
          name: category.name,
          brackets: brackets
        };
      }
    });
    
    return bracketsByCategory;
  };

  // Nueva función para agrupar por cinturón y peso
  const groupByBeltAndWeight = (participants) => {
    // Primero agrupamos por nivel de cinturón
    const beltGroups = {};
    
    participants.forEach(student => {
      const beltKey = getBeltGroup(student.beltLevel);
      if (!beltGroups[beltKey]) {
        beltGroups[beltKey] = [];
      }
      beltGroups[beltKey].push(student);
    });
    
    // Para cada grupo de cinturón, subagrupamos por peso similar
    const finalGroups = [];
    
    Object.values(beltGroups).forEach(beltGroup => {
      if (beltGroup.length <= 8) {
        // Si el grupo es pequeño, lo mantenemos como está
        finalGroups.push(beltGroup);
      } else {
        // Ordenamos por peso
        beltGroup.sort((a, b) => parseFloat(a.weight) - parseFloat(b.weight));
        
        // Dividimos en subgrupos de peso similar (máximo 8 por grupo)
        const numGroups = Math.ceil(beltGroup.length / 8);
        for (let i = 0; i < numGroups; i++) {
          const startIdx = i * Math.floor(beltGroup.length / numGroups);
          const endIdx = (i === numGroups - 1) ? beltGroup.length : (i + 1) * Math.floor(beltGroup.length / numGroups);
          finalGroups.push(beltGroup.slice(startIdx, endIdx));
        }
      }
    });
    
    return finalGroups;
  };

  // Nueva función para optimizar emparejamientos de primera ronda
  // Evita que participantes de la misma escuela se enfrenten en primera ronda cuando sea posible
  const optimizeFirstRoundPairings = (participants) => {
    if (participants.length <= 1) {
      return [...participants];
    }
    
    // Ordenar por escuela para agrupar
    const sortedBySchool = [...participants].sort((a, b) => 
      a.school.localeCompare(b.school)
    );
    
    // Crear un arreglo con el orden óptimo para los emparejamientos
    const optimizedOrder = [];
    const schools = {};
    
    // Registrar participantes por escuela
    sortedBySchool.forEach(participant => {
      if (!schools[participant.school]) {
        schools[participant.school] = [];
      }
      schools[participant.school].push(participant);
    });
    
    // Si hay un número impar de participantes, agregar un "bye" (descansa primera ronda)
    const totalParticipants = participants.length;
    const isPowerOfTwo = (totalParticipants & (totalParticipants - 1)) === 0;
    const targetSize = isPowerOfTwo ? totalParticipants : Math.pow(2, Math.ceil(Math.log2(totalParticipants)));
    
    // Distribuir participantes alternando escuelas cuando sea posible
    const schoolNames = Object.keys(schools);
    
    // Primera pasada: colocar un participante de cada escuela
    let currentIndex = 0;
    while (schoolNames.some(school => schools[school].length > 0) && optimizedOrder.length < targetSize) {
      const schoolIndex = currentIndex % schoolNames.length;
      const school = schoolNames[schoolIndex];
      
      if (schools[school].length > 0) {
        optimizedOrder.push(schools[school].shift());
      }
      
      currentIndex++;
    }
    
    // Llenar con "byes" (null) si es necesario para completar la potencia de 2
    while (optimizedOrder.length < targetSize) {
      optimizedOrder.push(null);
    }
    
    // Ahora reorganizar para que los enfrentamientos iniciales eviten mismas escuelas
    // La estrategia es colocar escuelas similares en lados opuestos del bracket
    const finalOrder = [];
    for (let i = 0; i < optimizedOrder.length; i++) {
      if (i % 2 === 0) {
        // Colocar en la primera mitad del bracket
        finalOrder.push(optimizedOrder[i]);
      } else {
        // Colocar en la segunda mitad del bracket
        finalOrder.push(optimizedOrder[optimizedOrder.length - Math.floor(i/2) - 1]);
      }
    }
    
    return finalOrder;
  };

  // Función auxiliar para obtener nombre de categoría de edad
  const getAgeCategoryName = (code) => {
    const categories = {
      'mini': 'Mini (5-7 años)',
      'infantil': 'Infantil (8-10 años)',
      'cadete': 'Cadete (11-14 años)',
      'juvenil': 'Juvenil (15-17 años)',
      'adulto': 'Adulto (18-30 años)',
      'senior': 'Senior (31-40 años)',
      'master': 'Master (41+ años)'
    };
    return categories[code] || code;
  };

  // Función auxiliar para agrupar cinturones
  const getBeltGroup = (belt) => {
    const beginner = ['blanco', 'blanco-amarillo', 'amarillo', 'amarillo-verde'];
    const intermediate = ['verde', 'verde-azul', 'azul', 'azul-rojo'];
    const advanced = ['rojo', 'rojo-negro'];
    const black = ['negro-1dan', 'negro-2dan', 'negro-3dan'];
    
    if (beginner.includes(belt)) return 'beginner';
    if (intermediate.includes(belt)) return 'intermediate';
    if (advanced.includes(belt)) return 'advanced';
    if (black.includes(belt)) return 'black';
    
    return 'other';
  };

  // Función auxiliar para obtener nombre del grupo de cinturón
  const getBeltGroupName = (group) => {
    const groups = {
      'beginner': 'Principiante',
      'intermediate': 'Intermedio',
      'advanced': 'Avanzado',
      'black': 'Cinturón Negro',
      'other': 'Otro'
    };
    return groups[group] || group;
  };

  // Modificar la función createRounds para manejar "byes" (participantes null)
  const createRounds = (numParticipants) => {
    // Calcular el número de rondas necesarias
    const numRounds = Math.ceil(Math.log2(numParticipants));
    
    // Calcular el número total de participantes (redondeado a potencia de 2)
    const totalParticipants = Math.pow(2, numRounds);
    
    // Crear estructuras de rondas
    const rounds = [];
    
    for (let r = 0; r < numRounds; r++) {
      const round = {
        name: r === numRounds - 1 ? 'Final' : 
              r === numRounds - 2 ? 'Semifinal' : 
              `Ronda ${r + 1}`,
        matches: []
      };
      
      const matchesInRound = Math.pow(2, numRounds - r - 1);
      
      for (let m = 0; m < matchesInRound; m++) {
        // En la primera ronda, asignar participantes directamente
        if (r === 0) {
          const comp1 = m * 2 < numParticipants ? m * 2 : null;
          const comp2 = m * 2 + 1 < numParticipants ? m * 2 + 1 : null;
          
          // Si uno de los competidores es null (bye), el otro avanza automáticamente
          let winner = null;
          if (comp1 === null && comp2 !== null) winner = comp2;
          if (comp2 === null && comp1 !== null) winner = comp1;
          
          round.matches.push({
            id: `r${r}_m${m}`,
            competitor1: comp1,
            competitor2: comp2,
            winner: winner
          });
        } else {
          // Para las demás rondas, los competidores se determinan por los ganadores de la ronda anterior
          round.matches.push({
            id: `r${r}_m${m}`,
            competitor1: null,
            competitor2: null,
            winner: null
          });
        }
      }
      
      rounds.push(round);
    }
    
    return rounds;
  };

  // Función para actualizar el ganador de un enfrentamiento
  const handleMatchWinner = async (bracketKey, bracketIndex, roundIndex, matchIndex, winnerId) => {
    try {
      if (!tournament || !tournament.brackets) {
        alert("No hay brackets generados.");
        return;
      }
      
      // Crear copia profunda de los brackets existentes
      const updatedBrackets = JSON.parse(JSON.stringify(tournament.brackets));
      
      // Actualizar el ganador del enfrentamiento
      const currentMatch = updatedBrackets[bracketKey].brackets[bracketIndex].rounds[roundIndex].matches[matchIndex];
      currentMatch.winner = winnerId;
      
      // Si hay siguiente ronda, actualizar el competidor correspondiente
      if (roundIndex + 1 < updatedBrackets[bracketKey].brackets[bracketIndex].rounds.length) {
        const nextRoundIndex = roundIndex + 1;
        const nextMatchIndex = Math.floor(matchIndex / 2);
        const isFirstCompetitor = matchIndex % 2 === 0;
        
        const nextMatch = updatedBrackets[bracketKey].brackets[bracketIndex].rounds[nextRoundIndex].matches[nextMatchIndex];
        
        if (isFirstCompetitor) {
          nextMatch.competitor1 = winnerId;
        } else {
          nextMatch.competitor2 = winnerId;
        }
      }
      
      // Actualizar en Firebase
      const tournamentRef = doc(db, "tournaments", tournament.id);
      await updateDoc(tournamentRef, {
        brackets: updatedBrackets
      });
      
      // Actualizar el estado local
      setTournament({
        ...tournament,
        brackets: updatedBrackets
      });
      
    } catch (error) {
      console.error("Error updating match winner:", error);
      alert("Error al actualizar el ganador: " + error.message);
    }
  };

  // Función auxiliar para mezclar array (shuffle)
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p>Cargando torneo...</p>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="alert alert-danger">
        No se pudo cargar el torneo. Vuelve a la <a href="/">página principal</a>.
      </div>
    );
  }

  return (
    <div>
      <TournamentHeader 
        tournament={tournament} 
        onBack={() => navigate('/')} 
      />
      
      <TournamentTabs 
        activeTab={activeTab} 
        onChangeTab={setActiveTab} 
      />
      
      <div className="tab-content mt-3">
        {activeTab === 'registration' && (
          <RegistrationForm onRegister={handleRegister} />
        )}
        
        {activeTab === 'participants' && (
          <ParticipantsList 
            participants={tournament.participants} 
            isAdmin={isAdmin} 
            onGenerateBrackets={handleGenerateBrackets} 
          />
        )}
        
        {activeTab === 'brackets' && (
          <BracketsView 
            brackets={tournament.brackets} 
            participants={tournament.participants}
            onSelectWinner={handleMatchWinner}
            isAdmin={isAdmin}
          />
        )}
      </div>
    </div>
  );
};

export default Tournament;
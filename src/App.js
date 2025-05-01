import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Componentes
import Header from './components/Header';
import Home from './pages/Home';
import Tournament from './pages/Tournament';
import NotFound from './pages/NotFound';

// Estilos
import './App.css';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDwZFMm3bCfjmEegUCvGTCi_PVy2lXRGFU",
  authDomain: "esp32-firebase-demo-a502c.firebaseapp.com",
  databaseURL: "https://esp32-firebase-demo-a502c-default-rtdb.firebaseio.com",
  projectId: "esp32-firebase-demo-a502c",
  storageBucket: "esp32-firebase-demo-a502c.firebasestorage.app",
  messagingSenderId: "793960059081",
  appId: "1:793960059081:web:764617c111d90b3e6b3d18"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <div className="container py-4">
          <Routes>
            <Route path="/" element={<Home db={db} />} />
            <Route path="/tournament/:id" element={<Tournament db={db} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
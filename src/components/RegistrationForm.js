import React, { useState } from 'react';

const RegistrationForm = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    type: 'alumno',
    name: '',
    beltLevel: '',
    ageCategory: '',
    exactAge: '',
    weight: '',
    gender: '',
    instructorRank: '',
    danLevel: '',
    school: '',
    trainingLocation: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister(formData);
    
    // Reiniciar el formulario
    setFormData({
      type: 'alumno',
      name: '',
      beltLevel: '',
      ageCategory: '',
      exactAge: '',
      weight: '',
      gender: '',
      instructorRank: '',
      danLevel: '',
      school: '',
      trainingLocation: ''
    });
  };

  return (
    <div className="card">
      <div className="card-header">Formulario de Registro</div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Tipo de Participante</label>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="participantType"
                id="type"
                value="alumno"
                checked={formData.type === 'alumno'}
                onChange={() => setFormData({ ...formData, type: 'alumno' })}
              />
              <label className="form-check-label" htmlFor="type">
                Alumno
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="participantType"
                id="type"
                value="maestro"
                checked={formData.type === 'maestro'}
                onChange={() => setFormData({ ...formData, type: 'maestro' })}
              />
              <label className="form-check-label" htmlFor="type">
                Maestro/Instructor
              </label>
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Nombre Completo
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          {formData.type === 'alumno' ? (
            <>
              <div className="mb-3">
                <label htmlFor="beltLevel" className="form-label">
                  Nivel de Cinturón
                </label>
                <select
                  className="form-select"
                  id="beltLevel"
                  value={formData.beltLevel}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione el nivel</option>
                  <option value="blanco">Blanco</option>
                  <option value="blanco-amarillo">Blanco/Amarillo</option>
                  <option value="amarillo">Amarillo</option>
                  <option value="amarillo-verde">Amarillo/Verde</option>
                  <option value="verde">Verde</option>
                  <option value="verde-azul">Verde/Azul</option>
                  <option value="azul">Azul</option>
                  <option value="azul-rojo">Azul/Rojo</option>
                  <option value="rojo">Rojo</option>
                  <option value="rojo-negro">Rojo/Negro</option>
                  <option value="negro-1dan">Negro (1er Dan)</option>
                  <option value="negro-2dan">Negro (2do Dan)</option>
                  <option value="negro-3dan">Negro (3er Dan o superior)</option>
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="ageCategory" className="form-label">
                  Categoría de Edad
                </label>
                <select
                  className="form-select"
                  id="ageCategory"
                  value={formData.ageCategory}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione la categoría</option>
                  <option value="mini">Mini (5-7 años)</option>
                  <option value="infantil">Infantil (8-10 años)</option>
                  <option value="cadete">Cadete (11-14 años)</option>
                  <option value="juvenil">Juvenil (15-17 años)</option>
                  <option value="adulto">Adulto (18-30 años)</option>
                  <option value="senior">Senior (31-40 años)</option>
                  <option value="master">Master (41+ años)</option>
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="exactAge" className="form-label">
                  Edad Exacta
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="exactAge"
                  min="5"
                  max="99"
                  value={formData.exactAge}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="weight" className="form-label">
                  Peso (kg)
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="weight"
                  step="0.1"
                  min="15"
                  max="150"
                  value={formData.weight}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="gender" className="form-label">
                  Género
                </label>
                <select
                  className="form-select"
                  id="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione el género</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                </select>
              </div>
            </>
          ) : (
            <>
              <div className="mb-3">
                <label htmlFor="instructorRank" className="form-label">
                  Rango
                </label>
                <select
                  className="form-select"
                  id="instructorRank"
                  value={formData.instructorRank}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione el rango</option>
                  <option value="asistente">Asistente de Instructor</option>
                  <option value="instructor">Instructor</option>
                  <option value="maestro">Maestro</option>
                  <option value="gran-maestro">Gran Maestro</option>
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="danLevel" className="form-label">
                  Nivel de Dan
                </label>
                <select
                  className="form-select"
                  id="danLevel"
                  value={formData.danLevel}
                  onChange={handleChange}
                >
                  <option value="">Seleccione el nivel de Dan</option>
                  <option value="1">1er Dan</option>
                  <option value="2">2do Dan</option>
                  <option value="3">3er Dan</option>
                  <option value="4">4to Dan</option>
                  <option value="5">5to Dan</option>
                  <option value="6">6to Dan</option>
                  <option value="7">7mo Dan</option>
                  <option value="8">8vo Dan o superior</option>
                </select>
              </div>
            </>
          )}

          <div className="mb-3">
            <label htmlFor="school" className="form-label">
              Escuela/Academia
            </label>
            <input
              type="text"
              className="form-control"
              id="school"
              value={formData.school}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="trainingLocation" className="form-label">
              Lugar de Entrenamiento
            </label>
            <input
              type="text"
              className="form-control"
              id="trainingLocation"
              value={formData.trainingLocation}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Registrarse en el Torneo
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
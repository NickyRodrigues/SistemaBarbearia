import React, { useState } from 'react';
import styles from './style';
import Cleave from 'cleave.js/react';
import 'cleave.js/dist/addons/cleave-phone.br';

const Home = ({ onAgendar, onCancelar }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSchedule = () => {
    if (name && phone) {
      onAgendar({ name, phone });
    }
  };

  const handleCancelAppointment = (e) => {
    e.preventDefault();
    if (onCancelar) {
      onCancelar(); // Função passada pelo App para mudar a etapa
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Logo circular */}
        <div style={styles.logoCircle}>
          <img
            src="/logo.jpg"
            alt="Logo"
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
          <div style={{ textAlign: 'center' }}>
            <div style={styles.barberLine}></div>
            <p style={styles.beta}>(beta-teste)</p>
          </div>
          <h1 style={styles.identificar}>Identificação</h1>
        </div>

        {/* Formulário */}
        <form style={styles.form} onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
            required
          />

          <Cleave
            options={{ phone: true, phoneRegionCode: 'BR' }}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Telefone"
            style={styles.input}
            required
          />

          <button
            onClick={handleCancelAppointment}
            style={styles.cancelButton}
          >
            Cancelar agendamento
          </button>

          <button
            type="submit"
            onClick={handleSchedule}
            style={{
              ...styles.button,
              opacity: !name || !phone ? 0.5 : 1,
              cursor: !name || !phone ? 'not-allowed' : 'pointer',
            }}
            disabled={!name || !phone}
          >
            Agendar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
